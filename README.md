# Mesto

Финальный проект курса фронтенд-разработки. Интерактивная страница со списком карточек, лайками, удалением, редактированием профиля и сменой аватара. Подключение к API Practicum, сборка через Vite, деплой через GitHub Actions из приватного репозитория с исходниками в отдельный публичный репозиторий со сборкой.

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

Схема:

- исходный код находится в **приватном** репозитории;
- GitHub Actions запускается в приватном репозитории при push в `main`;
- workflow ставит зависимости и собирает проект через `npm run build`;
- содержимое папки `dist` пушится в **отдельный публичный** репозиторий;
- в публичном репозитории лежит только готовая сборка;
- GitHub Pages настраивается в публичном репозитории.

Workflow: `.github/workflows/deploy.yml` (`peaceiris/actions-gh-pages@v3`, опция `external_repository`).

### Secrets в приватном репозитории (с исходниками)

Settings → Secrets and variables → Actions → New repository secret:

| Имя                    | Значение                                                                 |
| ---------------------- | ------------------------------------------------------------------------ |
| `VITE_MESTO_GROUP_ID`  | ID когорты из курса, например `wff-cohort-XX`                           |
| `VITE_MESTO_TOKEN`     | токен доступа к API Practicum                                           |
| `PUBLIC_PAGES_TOKEN`   | GitHub Personal Access Token с правами `repo` (для пуша в публичный репо) |
| `PUBLIC_PAGES_REPO`    | публичный репозиторий в формате `owner/repo`, например `semended/mesto-production` |
| `PUBLIC_PAGES_BRANCH`  | (опционально) ветка публикации; по умолчанию `main`                     |

`PUBLIC_PAGES_TOKEN` создаётся в GitHub → Settings → Developer settings → Personal access tokens. Нужны права `repo` (полный доступ к репозиториям пользователя).

### Настройка публичного репозитория

В публичном репозитории (туда деплоится сборка):

- Settings → **Pages**
- Source: **Deploy from a branch**
- Branch: **main**
- Folder: **`/` (root)**

После первого успешного запуска workflow в публичном репо появится ветка `main` с содержимым `dist/`. Pages подхватит её и опубликует сайт по адресу `https://<owner>.github.io/<repo>/`.

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
