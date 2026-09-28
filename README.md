# YoncFALL.github.io

Сайт YoncFALL — софт для Windows. Статическая страница, собирается из `apps.json`.

## Что внутри

```
index.html      разметка-обёртка, всё остальное подгружает скриптом
apps.json       данные: категории, приложения, ссылки на скачивание
assets/style.css  оформление
assets/site.js    логика: вкладки категорий, карточки приложений
assets/*.png      скриншоты
favicon.svg
```

## Как обновить

Всё содержимое страницы задаётся в `apps.json`. После правки:

```powershell
git add apps.json
git commit -m "описание"
git push
```

GitHub Pages подхватит изменения за минуту-две.

## Ссылка на скачивание

Ссылка ведёт на файл с постоянным именем:

```
https://github.com/YoncFall/VPN-LAUNCHER/releases/latest/download/VPN-LAUNCHER-Setup.exe
```

Поэтому при выходе новой версии сайт править не нужно — ссылка всегда отдаёт
последний релиз и не ломается.

## Локальный просмотр

Просто откройте `index.html` в браузере. Учесть, что `fetch` не работает с
`file://` — для проверки нужен локальный сервер:

```powershell
python -m http.server 8000
```