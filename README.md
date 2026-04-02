# element-lang-vscode

Расширение подсветки синтаксиса VS Code для языка 1С:Элемент (`.xbsl`).

## Что уже есть

- TextMate grammar в `syntaxes/xbsl.tmLanguage.json`
- конфигурация редактора в `language-configuration.json`
- регистрация языка в `package.json`
- пример файла в `examples/hello.xbsl`

## Как запустить

1. Откройте эту папку в VS Code.
2. Нажмите `F5`, чтобы запустить Extension Development Host.
3. Откройте `examples/hello.xbsl`.
4. Проверьте токены через `Developer: Inspect Editor Tokens and Scopes`.

## Что настраивать дальше

В `package.json`:

- `contributes.languages[0].extensions`, когда будете добавлять другие типы файлов, например YAML
- `displayName`, `description`, `publisher`

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
