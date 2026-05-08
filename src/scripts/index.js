import '../pages/index.css';

import { createCard } from './components/card.js';
import {
  openModal,
  closeModal,
  setupOverlayAndCloseHandlers,
} from './components/modal.js';
import { enableValidation, clearValidation } from './components/validation.js';
import {
  getUserInfo,
  getCardList,
  setUserInfo,
  setUserAvatar,
  addCard,
} from './components/api.js';

const validationSettings = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible',
};

// DOM
const placesList = document.querySelector('.places__list');

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileImage = document.querySelector('.profile__image');
const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');

const popupEdit = document.querySelector('.popup_type_edit');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupAvatar = document.querySelector('.popup_type_avatar');
const popupImage = document.querySelector('.popup_type_image');

const popupImageEl = popupImage.querySelector('.popup__image');
const popupCaption = popupImage.querySelector('.popup__caption');

const formEdit = document.forms['edit-profile'];
const formNewCard = document.forms['new-place'];
const formAvatar = document.forms['edit-avatar'];

let currentUserId = null;

// --- helpers ---

function withSubmitState(form, loadingText, asyncFn) {
  const button = form.querySelector('.popup__button');
  const originalText = button.textContent;
  button.textContent = loadingText;
  return asyncFn().finally(() => {
    button.textContent = originalText;
  });
}

function openImagePopup(card) {
  popupImageEl.src = card.link;
  popupImageEl.alt = card.name;
  popupCaption.textContent = card.name;
  openModal(popupImage);
}

function renderUser(user) {
  profileTitle.textContent = user.name;
  profileDescription.textContent = user.about;
  profileImage.style.backgroundImage = `url('${user.avatar}')`;
}

function renderCards(cards) {
  placesList.innerHTML = '';
  cards.forEach((cardData) => {
    placesList.append(
      createCard(cardData, currentUserId, { onImageClick: openImagePopup })
    );
  });
}

// --- handlers ---

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  const { name, description } = formEdit.elements;
  withSubmitState(formEdit, 'Сохранение...', () =>
    setUserInfo({ name: name.value, about: description.value })
      .then((updated) => {
        renderUser(updated);
        closeModal(popupEdit);
      })
      .catch((err) => console.log(err))
  );
}

function handleNewCardSubmit(evt) {
  evt.preventDefault();
  const nameInput = formNewCard.elements['place-name'];
  const linkInput = formNewCard.elements['link'];
  withSubmitState(formNewCard, 'Создание...', () =>
    addCard({ name: nameInput.value, link: linkInput.value })
      .then((newCard) => {
        placesList.prepend(
          createCard(newCard, currentUserId, { onImageClick: openImagePopup })
        );
        formNewCard.reset();
        clearValidation(formNewCard, validationSettings);
        closeModal(popupNewCard);
      })
      .catch((err) => console.log(err))
  );
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const url = formAvatar.elements['avatar'].value;
  withSubmitState(formAvatar, 'Сохранение...', () =>
    setUserAvatar(url)
      .then((updated) => {
        renderUser(updated);
        formAvatar.reset();
        clearValidation(formAvatar, validationSettings);
        closeModal(popupAvatar);
      })
      .catch((err) => console.log(err))
  );
}

// --- wiring ---

profileEditButton.addEventListener('click', () => {
  formEdit.elements.name.value = profileTitle.textContent;
  formEdit.elements.description.value = profileDescription.textContent;
  clearValidation(formEdit, validationSettings);
  openModal(popupEdit);
});

profileAddButton.addEventListener('click', () => {
  formNewCard.reset();
  clearValidation(formNewCard, validationSettings);
  openModal(popupNewCard);
});

profileImage.addEventListener('click', () => {
  formAvatar.reset();
  clearValidation(formAvatar, validationSettings);
  openModal(popupAvatar);
});

profileImage.addEventListener('keydown', (evt) => {
  if (evt.key === 'Enter' || evt.key === ' ') {
    evt.preventDefault();
    profileImage.click();
  }
});

document.querySelectorAll('.popup').forEach((popup) => {
  popup.classList.add('popup_is-animated');
  setupOverlayAndCloseHandlers(popup);
});

formEdit.addEventListener('submit', handleEditProfileSubmit);
formNewCard.addEventListener('submit', handleNewCardSubmit);
formAvatar.addEventListener('submit', handleAvatarSubmit);

enableValidation(validationSettings);

// --- bootstrap ---

Promise.all([getCardList(), getUserInfo()])
  .then(([cards, userData]) => {
    currentUserId = userData._id;
    renderUser(userData);
    renderCards(cards);
  })
  .catch((err) => {
    console.log(err);
  });
