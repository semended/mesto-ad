const groupId = import.meta.env.VITE_MESTO_GROUP_ID;
const token = import.meta.env.VITE_MESTO_TOKEN;

if (!groupId || !token) {
  console.warn(
    '[api] VITE_MESTO_GROUP_ID и/или VITE_MESTO_TOKEN не заданы. Создай .env.local на основе .env.local.example.'
  );
}

const config = {
  baseUrl: `https://mesto.nomoreparties.co/v1/${groupId}`,
  headers: {
    authorization: token,
    'Content-Type': 'application/json',
  },
};

const getResponseData = (res) => {
  return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
};

const request = (path, options = {}) => {
  return fetch(`${config.baseUrl}${path}`, {
    headers: config.headers,
    ...options,
  }).then(getResponseData);
};

export const getUserInfo = () => request('/users/me');

export const getCardList = () => request('/cards');

export const setUserInfo = ({ name, about }) =>
  request('/users/me', {
    method: 'PATCH',
    body: JSON.stringify({ name, about }),
  });

export const setUserAvatar = (avatar) =>
  request('/users/me/avatar', {
    method: 'PATCH',
    body: JSON.stringify({ avatar }),
  });

export const addCard = ({ name, link }) =>
  request('/cards', {
    method: 'POST',
    body: JSON.stringify({ name, link }),
  });

export const deleteCard = (cardId) =>
  request(`/cards/${cardId}`, {
    method: 'DELETE',
  });

export const changeLikeCardStatus = (cardId, isLiked) =>
  request(`/cards/likes/${cardId}`, {
    method: isLiked ? 'DELETE' : 'PUT',
  });
