import { createCardElement } from "./components/card.js";
import {
  openModalWindow,
  closeModalWindow,
  setCloseModalWindowEventListeners,
} from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";
import {
  getUserInfo,
  getCardList,
  setUserInfo,
  setUserAvatar,
  addCard,
  deleteCard,
  changeLikeCardStatus,
} from "./components/api.js";

const validationSettings = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

// DOM-узлы
const placesWrap = document.querySelector(".places__list");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");
const openProfileFormButton = document.querySelector(".profile__edit-button");
const openCardFormButton = document.querySelector(".profile__add-button");

const profileFormModalWindow = document.querySelector(".popup_type_edit");
const profileForm = profileFormModalWindow.querySelector(".popup__form");
const profileTitleInput = profileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = profileForm.querySelector(
  ".popup__input_type_description"
);

const cardFormModalWindow = document.querySelector(".popup_type_new-card");
const cardForm = cardFormModalWindow.querySelector(".popup__form");
const cardNameInput = cardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = cardForm.querySelector(".popup__input_type_url");

const avatarFormModalWindow = document.querySelector(".popup_type_edit-avatar");
const avatarForm = avatarFormModalWindow.querySelector(".popup__form");
const avatarInput = avatarForm.querySelector(".popup__input_type_avatar");

const imageModalWindow = document.querySelector(".popup_type_image");
const imageElement = imageModalWindow.querySelector(".popup__image");
const imageCaption = imageModalWindow.querySelector(".popup__caption");

let currentUserId = null;

// Хэлперы
const renderUser = (userData) => {
  profileTitle.textContent = userData.name;
  profileDescription.textContent = userData.about;
  profileAvatar.style.backgroundImage = `url('${userData.avatar}')`;
};

const renderInitialCards = (cards) => {
  cards.forEach((cardData) => {
    placesWrap.append(
      createCardElement(cardData, currentUserId, {
        onPreviewPicture: handlePreviewPicture,
        onLikeIcon: changeLikeCardStatus,
        onDeleteCard: handleDeleteCard,
      })
    );
  });
};

const setSubmitButtonText = (formElement, text) => {
  const buttonElement = formElement.querySelector(".popup__button");
  buttonElement.textContent = text;
};

// Обработчики
function handlePreviewPicture({ name, link }) {
  imageElement.src = link;
  imageElement.alt = name;
  imageCaption.textContent = name;
  openModalWindow(imageModalWindow);
}

function handleDeleteCard(cardId, cardElement) {
  deleteCard(cardId)
    .then(() => {
      cardElement.remove();
    })
    .catch((err) => {
      console.log(err);
    });
}

const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();
  setSubmitButtonText(profileForm, "Сохранение...");
  setUserInfo({
    name: profileTitleInput.value,
    about: profileDescriptionInput.value,
  })
    .then((userData) => {
      renderUser(userData);
      clearValidation(profileForm, validationSettings);
      closeModalWindow(profileFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setSubmitButtonText(profileForm, "Сохранить");
    });
};

const handleCardFormSubmit = (evt) => {
  evt.preventDefault();
  setSubmitButtonText(cardForm, "Создание...");
  addCard({ name: cardNameInput.value, link: cardLinkInput.value })
    .then((newCard) => {
      placesWrap.prepend(
        createCardElement(newCard, currentUserId, {
          onPreviewPicture: handlePreviewPicture,
          onLikeIcon: changeLikeCardStatus,
          onDeleteCard: handleDeleteCard,
        })
      );
      cardForm.reset();
      clearValidation(cardForm, validationSettings);
      closeModalWindow(cardFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setSubmitButtonText(cardForm, "Создать");
    });
};

const handleAvatarFormSubmit = (evt) => {
  evt.preventDefault();
  setSubmitButtonText(avatarForm, "Сохранение...");
  setUserAvatar(avatarInput.value)
    .then((userData) => {
      renderUser(userData);
      avatarForm.reset();
      clearValidation(avatarForm, validationSettings);
      closeModalWindow(avatarFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setSubmitButtonText(avatarForm, "Сохранить");
    });
};

// Слушатели
profileForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFormSubmit);

openProfileFormButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  clearValidation(profileForm, validationSettings);
  openModalWindow(profileFormModalWindow);
});

openCardFormButton.addEventListener("click", () => {
  cardForm.reset();
  clearValidation(cardForm, validationSettings);
  openModalWindow(cardFormModalWindow);
});

profileAvatar.addEventListener("click", () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationSettings);
  openModalWindow(avatarFormModalWindow);
});

document.querySelectorAll(".popup").forEach((popup) => {
  popup.classList.add("popup_is-animated");
  setCloseModalWindowEventListeners(popup);
});

enableValidation(validationSettings);

// Загрузка данных с сервера
Promise.all([getUserInfo(), getCardList()])
  .then(([userData, cards]) => {
    currentUserId = userData._id;
    renderUser(userData);
    renderInitialCards(cards);
  })
  .catch((err) => {
    console.log(err);
  });
