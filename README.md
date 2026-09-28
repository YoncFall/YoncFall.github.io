# Сайт YoncFALL — статический, GitHub Pages

Одностраничный сайт со списком софта. Вкладки строятся из `apps.json`,
разметка и стили общие, добавление новой программы — одна запись в JSON.

## Как запустить локально

Нужен именно сервер, а не открытие `index.html` двойным кликом: браузер
блокирует `fetch('apps.json')` по политике `file://` и страница останется
пустой.

```powershell
python -m http.server 8777
```

Дальше открыть <http://127.0.0.1:8777/index.html>.

## Файлы

| Файл | Зачем |
|------|-------|
| `index.html` | разметка страницы |
| `apps.json` | **всё содержимое**: вкладки, софт, ссылки, описания |
| `assets/style.css` | оформление |
| `assets/site.js` | загрузка JSON, вкладки, карточки |
| `assets/*.png` | скриншоты софта |
| `favicon.svg` | иконка вкладки браузера |

## Добавить программу

Дописать объект в `apps[].categories[]` — вкладки появятся сами:

```json
{
  "id": "utilities",
  "title": "Утилиты",
  "apps": [
    {
      "slug": "my-tool",
      "name": "My Tool",
      "tagline": "Короткое описание",
      "version": "1.0.0",
      "platform": "Windows 10+ x64",
      "size": "2.1 MB",
      "license": "MIT",
      "screenshot": "assets/my-tool.png",
      "download": "https://github.com/.../releases/download/v1.0.0/my-tool.zip",
      "source": "https://github.com/..."
    }
  ]
}
```

Обязательны только `name` и `download`. Остальные поля необязательны —
пустые просто не выводятся. `download` удобнее вести на
`.../releases/latest/download/<файл>`: ссылка не устареет при новых
версиях, в отличие от пути с `/tag/v1.0.0/`.

## Публикация

Репозиторий `yoncfall-tech.github.io`, ветка `main`, корень.
Включить: Settings → Pages → Source: `Deploy from a branch` →
branch `main`, папка `/ (root)`.

Адрес: <https://yoncfall-tech.github.io/>

## Палитра

Взята из темы приложения (`src/theme.ps1`), чтобы сайт и софт
выглядели одинаково.

| Роль | Значение |
|------|----------|
| фон | `#0c0e13` |
| карточка | `#181b25` |
| обводка | `#2e3444` |
| текст | `#e6eaf2` |
| приглушённый | `#7c869c` |
| акцент | `#00d8ff` |
| успех | `#00f0a8` |
