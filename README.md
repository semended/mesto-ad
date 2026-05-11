# Mesto

**Открыть проект:** https://semended.github.io/mesto-ad/

Финальный проект курса фронтенд-разработки. Интерактивная страница со списком карточек, лайками, удалением, редактированием профиля и сменой аватара. Подключение к API Practicum, сборка через Vite, деплой на GitHub Pages через `gh-pages`.

## Стек

- HTML5 / CSS3 (БЭМ, методология Nested)
- JavaScript (ES Modules)
- Vite
- Fetch API
- GitHub Actions → внешний публичный репозиторий → GitHub Pages

## Структура

```
.
├── index.html
├── vite.config.js           # base: './'
├── package.json
├── .env.local.example
├── .github/workflows/deploy.yml
└── src/
    ├── pages/index.css
    ├── vendor/{normalize.css, fonts/}
    ├── blocks/{page,header,content,profile,places,card,popup,footer}/
    ├── images/
    └── scripts/
        ├── index.js
        └── components/{api,card,modal,validation}.js
```

## Запуск локально

```bash
cp .env.local.example .env.local
# подставь VITE_MESTO_GROUP_ID и VITE_MESTO_TOKEN

npm install
npm run dev
```

## Сборка

```bash
npm run build      # → dist/
npm run preview
```

## Деплой

```bash
npm run deploy
```

Скрипт собирает проект и пушит содержимое `dist/` в ветку `gh-pages` текущего репозитория через пакет `gh-pages`. GitHub Pages в настройках репозитория:

- Settings → **Pages**
- Source: **Deploy from a branch**
- Branch: **`gh-pages`**, Folder: **`/ (root)`**

После публикации сайт доступен по адресу `https://<owner>.github.io/<repo>/`.

`base: './'` в `vite.config.js` гарантирует корректные относительные пути на любом подпути GH Pages.

## API

Базовый URL: `https://mesto.nomoreparties.co/v1/${VITE_MESTO_GROUP_ID}`. Авторизация — заголовок `authorization: <token>`.

Реализованные методы (`src/scripts/components/api.js`):

- `getUserInfo()` — `GET /users/me`
- `getCardList()` — `GET /cards`
- `setUserInfo({ name, about })` — `PATCH /users/me`
- `setUserAvatar(avatar)` — `PATCH /users/me/avatar`
- `addCard({ name, link })` — `POST /cards`
- `deleteCard(cardId)` — `DELETE /cards/:cardId`
- `changeLikeCardStatus(cardId, isLiked)` — `PUT|DELETE /cards/likes/:cardId` (DELETE если уже лайкнуто, иначе PUT)

Общая обработка ответа:

```js
const getResponseData = (res) =>
  res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
```

## Что реализовано

- [x] Загрузка профиля и карточек через `Promise.all([getCardList(), getUserInfo()])`
- [x] `currentUserId` сохраняется из `userData._id`
- [x] Профиль и карточки отрисовываются из ответа сервера (без локального массива)
- [x] Счётчик лайков из `cardData.likes.length`, активность — через `currentUserId`
- [x] Лайк через PUT/DELETE, счётчик обновляется из ответа сервера
- [x] Кнопка удаления видна только владельцу карточки
- [x] Карточка удаляется/добавляется в DOM **только после успешного ответа сервера**
- [x] Попапы закрываются только после успешного ответа сервера
- [x] UX «Сохранение...» (профиль, аватар) и «Создание...» (новая карточка) с возвратом текста в `finally`
- [x] Валидация форм через JS + Constraint Validation API; `clearValidation` при открытии
- [x] Закрытие попапов: крестик, оверлей, ESC
- [x] Адаптив

## Переменные окружения

`.env.local` коммитить нельзя. В git попадает только `.env.local.example`.
