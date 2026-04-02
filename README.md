# element-lang-vscode

Расширение VS Code для подсветки синтаксиса языка 1С:Элемент (`.xbsl`).

## Как запустить

Для установки:

1. Откройте страницу [Releases](https://github.com/avolkov-git/element-lang-vscode/releases).
2. Скачайте последний файл `.vsix`.
3. В VS Code выполните `Extensions: Install from VSIX...`.
4. Выберите скачанный `.vsix`.

Для разработки:

1. Откройте проект в VS Code.
2. Нажмите `F5`, чтобы запустить `Extension Development Host`.
3. В новом окне откройте [examples/hello.xbsl](/Users/aleksandrvolkov/pet-project/element-ai/element-lang-vscode/examples/hello.xbsl).
4. Для проверки токенов используйте `Developer: Inspect Editor Tokens and Scopes`.
5. Для проверки автопереключения меняйте обычную тему VS Code между светлой и темной.

## Как работает палитра

Расширение не переключает `workbench.colorTheme`. Вместо этого оно определяет текущий тип темы VS Code и подмешивает свои `textMateRules` для XBSL поверх активной темы.

По умолчанию используется режим `auto`:

- при светлой теме VS Code включается светлая XBSL-палитра
- при темной теме VS Code включается темная XBSL-палитра

При необходимости поведение можно переопределить:

- `XBSL: Use Automatic Syntax Palette`
- `XBSL: Use Dark Syntax Palette`
- `XBSL: Use Light Syntax Palette`
- `XBSL: Disable Managed Syntax Palette`

Или через настройку:

- `xbsl.syntaxPalette.mode = auto`
- `xbsl.syntaxPalette.mode = dark`
- `xbsl.syntaxPalette.mode = light`
- `xbsl.syntaxPalette.mode = off`

Это позволяет, например, оставить светлую тему VS Code, но принудительно использовать темную XBSL-палитру.
