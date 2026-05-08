import { deleteCard, changeLikeCardStatus } from './api.js';

const cardTemplate = document.querySelector('#card-template').content;

export function createCard(cardData, currentUserId, handlers) {
  const { onImageClick } = handlers;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

  const image = cardElement.querySelector('.card__image');
  const title = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCount = cardElement.querySelector('.card__like-count');
  const deleteButton = cardElement.querySelector('.card__delete-button');

  image.src = cardData.link;
  image.alt = cardData.name;
  title.textContent = cardData.name;
  likeCount.textContent = cardData.likes.length;

  const isOwner = cardData.owner._id === currentUserId;
  if (!isOwner) {
    deleteButton.classList.add('card__delete-button_hidden');
  }

  const isLikedByMe = cardData.likes.some((u) => u._id === currentUserId);
  if (isLikedByMe) {
    likeButton.classList.add('card__like-button_is-active');
  }

  likeButton.addEventListener('click', () => {
    const isLiked = likeButton.classList.contains('card__like-button_is-active');
    likeButton.disabled = true;
    changeLikeCardStatus(cardData._id, isLiked)
      .then((updated) => {
        likeButton.classList.toggle('card__like-button_is-active', !isLiked);
        likeCount.textContent = updated.likes.length;
      })
      .catch((err) => console.log(err))
      .finally(() => {
        likeButton.disabled = false;
      });
  });

  if (isOwner) {
    deleteButton.addEventListener('click', () => {
      deleteButton.disabled = true;
      deleteCard(cardData._id)
        .then(() => {
          cardElement.remove();
        })
        .catch((err) => {
          console.log(err);
          deleteButton.disabled = false;
        });
    });
  }

  image.addEventListener('click', () => onImageClick(cardData));

  return cardElement;
}
