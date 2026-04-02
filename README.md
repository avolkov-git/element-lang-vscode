# element-lang-vscode

Расширение подсветки синтаксиса VS Code для языка 1С:Элемент (`.xbsl`).

## Что уже есть

- TextMate grammar в `syntaxes/xbsl.tmLanguage.json`
- конфигурация редактора в `language-configuration.json`
- регистрация языка в `package.json`
- управляемая палитра XBSL для `dark` и `light` схем VS Code
- пример файла в `examples/hello.xbsl`

## Как запустить

1. Откройте эту папку в VS Code.
2. Нажмите `F5`, чтобы запустить Extension Development Host.
3. Откройте `examples/hello.xbsl`.
4. Проверьте токены через `Developer: Inspect Editor Tokens and Scopes`.
5. Для проверки автоподстройки переключайте обычные темы VS Code между `dark` и `light`.

## Как работает палитра

Расширение не переключает `workbench.colorTheme`. Вместо этого оно:

- смотрит на текущий тип темы VS Code (`dark` / `light`)
- выбирает соответствующую XBSL-палитру
- подмешивает только свои `textMateRules` в user-level `editor.tokenColorCustomizations` для активной темы

По умолчанию работает режим `auto`.

Можно вручную переопределить поведение:

- команда `XBSL: Use Automatic Syntax Palette`
- команда `XBSL: Use Dark Syntax Palette`
- команда `XBSL: Use Light Syntax Palette`
- команда `XBSL: Disable Managed Syntax Palette`

Или через настройку:

- `xbsl.syntaxPalette.mode = auto`
- `xbsl.syntaxPalette.mode = dark`
- `xbsl.syntaxPalette.mode = light`
- `xbsl.syntaxPalette.mode = off`

Это позволяет, например, оставить светлую тему VS Code, но принудительно использовать темную XBSL-палитру.

## Что настраивать дальше

В `package.json`:

- `contributes.languages[0].extensions`, когда будете добавлять другие типы файлов, например YAML
- `displayName`, `description`, `publisher`
- команды и режим `xbsl.syntaxPalette.mode`, если захотите переименовать или расширить поведение overlay

В `syntaxes/xbsl.tmLanguage.json`:

- заменить стартовые XBSL-ключевые слова на точный синтаксис вашего диалекта
- скорректировать правила комментариев и строк, если они отличаются
- добавить language-specific конструкции: аннотации, дженерики, интерполяцию, атрибуты и т.д.

## Следующие шаги

После стабилизации XBSL-подсветки можно добавить:

- snippets
- более точные правила отступов и парных скобок
- поддержку YAML как второго языка в том же extension
- language server или semantic tokens, если нужна более богатая поддержка
