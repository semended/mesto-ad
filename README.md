# Mesto

**Открыть проект:** https://semended.github.io/mesto-pages/

Интерактивная страница с карточками: загрузка профиля и карточек с сервера, лайки, удаление своих карточек, добавление новой карточки, обновление аватара, попап с увеличенной картинкой, валидация форм.

## Стек

- HTML5 / CSS3 (БЭМ, методология Nested)
- JavaScript (ES Modules)
- Vite
- Fetch API
- GitHub Actions → внешний публичный репозиторий → GitHub Pages

## Запуск локально

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
npm run preview
```

## Публикация на GitHub Pages

```bash
npm run deploy
```

Также при каждом push в `main` запускается workflow `.github/workflows/deploy.yml`, который собирает проект и публикует содержимое `dist/` в публичный репозиторий через GitHub Actions.
