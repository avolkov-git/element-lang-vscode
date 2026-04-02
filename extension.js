const fs = require("fs");
const path = require("path");
const vscode = require("vscode");

const EXTENSION_NAMESPACE = "xbsl";
const MODE_SETTING = `${EXTENSION_NAMESPACE}.syntaxPalette.mode`;
const MANAGED_THEME_NAMES_KEY = `${EXTENSION_NAMESPACE}.managedThemeNames`;
const MANAGED_RULE_PREFIX = "XBSL Managed:";

let paletteCache = null;

function activate(context) {
  const sync = () => {
    void syncManagedPalette(context).catch((error) => {
      console.error("Failed to synchronize XBSL syntax palette.", error);
    });
  };

  context.subscriptions.push(
    vscode.commands.registerCommand("xbsl.syntaxPalette.useAuto", () => setMode("auto")),
    vscode.commands.registerCommand("xbsl.syntaxPalette.useDark", () => setMode("dark")),
    vscode.commands.registerCommand("xbsl.syntaxPalette.useLight", () => setMode("light")),
    vscode.commands.registerCommand("xbsl.syntaxPalette.disable", () => setMode("off")),
    vscode.window.onDidChangeActiveColorTheme(sync),
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (
        event.affectsConfiguration(MODE_SETTING) ||
        event.affectsConfiguration("workbench.colorTheme")
      ) {
        void sync();
      }
    })
  );
  sync();
}

function deactivate() {}

async function setMode(mode) {
  const config = vscode.workspace.getConfiguration(EXTENSION_NAMESPACE);
  await config.update("syntaxPalette.mode", mode, vscode.ConfigurationTarget.Global);
}

async function syncManagedPalette(context) {
  const mode = getMode();

  if (mode === "off") {
    await removeManagedRulesFromKnownThemes(context);
    return;
  }

  const themeName = getActiveThemeName();
  if (!themeName) {
    return;
  }

  const paletteName = resolvePaletteName(mode, vscode.window.activeColorTheme.kind);
  const paletteRules = loadPaletteRules(paletteName);

  await upsertThemeRules(themeName, paletteRules);
  await rememberManagedThemeName(context, themeName);
}

function getMode() {
  const mode = vscode.workspace
    .getConfiguration(EXTENSION_NAMESPACE)
    .get("syntaxPalette.mode", "auto");

  return ["auto", "dark", "light", "off"].includes(mode) ? mode : "auto";
}

function getActiveThemeName() {
  const themeName = vscode.workspace
    .getConfiguration("workbench")
    .get("colorTheme");

  return typeof themeName === "string" && themeName.trim() ? themeName : null;
}

function resolvePaletteName(mode, colorThemeKind) {
  if (mode === "dark" || mode === "light") {
    return mode;
  }

  return colorThemeKind === vscode.ColorThemeKind.Light ||
    colorThemeKind === vscode.ColorThemeKind.HighContrastLight
    ? "light"
    : "dark";
}

function loadPaletteRules(paletteName) {
  if (!paletteCache) {
    paletteCache = {
      dark: readPaletteFile("xbsl-dark-color-theme.json"),
      light: readPaletteFile("xbsl-light-color-theme.json")
    };
  }

  return paletteCache[paletteName];
}

function readPaletteFile(fileName) {
  const filePath = path.join(__dirname, "themes", fileName);
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = JSON.parse(raw);
  const rules = Array.isArray(parsed.tokenColors) ? parsed.tokenColors : [];

  return rules.map((rule, index) => ({
    ...rule,
    name: `${MANAGED_RULE_PREFIX} ${fileName} #${index + 1}`
  }));
}

async function upsertThemeRules(themeName, managedRules) {
  const config = vscode.workspace.getConfiguration("editor");
  const current = getGlobalTokenColorCustomizations(config);
  const themeKey = `[${themeName}]`;
  const themeValue = cloneObject(current[themeKey] || {});
  const existingRules = Array.isArray(themeValue.textMateRules) ? themeValue.textMateRules : [];

  themeValue.textMateRules = [
    ...existingRules.filter((rule) => !isManagedRule(rule)),
    ...managedRules
  ];

  current[themeKey] = themeValue;

  await config.update(
    "tokenColorCustomizations",
    current,
    vscode.ConfigurationTarget.Global
  );
}

async function removeManagedRulesFromKnownThemes(context) {
  const themeNames = context.globalState.get(MANAGED_THEME_NAMES_KEY, []);
  if (!Array.isArray(themeNames) || themeNames.length === 0) {
    return;
  }

  const config = vscode.workspace.getConfiguration("editor");
  const current = getGlobalTokenColorCustomizations(config);
  let changed = false;

  for (const themeName of themeNames) {
    const themeKey = `[${themeName}]`;
    const themeValue = current[themeKey];

    if (!themeValue || typeof themeValue !== "object" || Array.isArray(themeValue)) {
      continue;
    }

    const nextThemeValue = cloneObject(themeValue);
    const rules = Array.isArray(nextThemeValue.textMateRules) ? nextThemeValue.textMateRules : [];
    const filteredRules = rules.filter((rule) => !isManagedRule(rule));

    if (filteredRules.length > 0) {
      nextThemeValue.textMateRules = filteredRules;
    } else {
      delete nextThemeValue.textMateRules;
    }

    if (JSON.stringify(nextThemeValue) === JSON.stringify(themeValue)) {
      continue;
    }

    if (Object.keys(nextThemeValue).length === 0) {
      delete current[themeKey];
    } else {
      current[themeKey] = nextThemeValue;
    }

    changed = true;
  }

  if (changed) {
    await config.update(
      "tokenColorCustomizations",
      current,
      vscode.ConfigurationTarget.Global
    );
  }

  await context.globalState.update(MANAGED_THEME_NAMES_KEY, []);
}

async function rememberManagedThemeName(context, themeName) {
  const current = context.globalState.get(MANAGED_THEME_NAMES_KEY, []);
  const next = Array.isArray(current) ? current.slice() : [];

  if (!next.includes(themeName)) {
    next.push(themeName);
    await context.globalState.update(MANAGED_THEME_NAMES_KEY, next);
  }
}

function isManagedRule(rule) {
  return Boolean(
    rule &&
      typeof rule === "object" &&
      typeof rule.name === "string" &&
      rule.name.startsWith(MANAGED_RULE_PREFIX)
  );
}

function cloneObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return JSON.parse(JSON.stringify(value));
}

function getGlobalTokenColorCustomizations(config) {
  const inspected = config.inspect("tokenColorCustomizations");
  return cloneObject(inspected?.globalValue || {});
}

module.exports = {
  activate,
  deactivate
};
