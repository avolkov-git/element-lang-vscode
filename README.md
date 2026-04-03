# 1C:Element Language Support (XBSL)

Расширение Visual Studio Code для подсветки синтаксиса языка 1С:Элемент (.xbsl)

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
