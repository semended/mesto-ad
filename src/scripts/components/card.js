const getTemplate = () => {
  return document
    .getElementById("card-template")
    .content.querySelector(".card")
    .cloneNode(true);
};

export const isCardLiked = (cardData, currentUserId) =>
  cardData.likes.some((user) => user._id === currentUserId);

export const isCardOwner = (cardData, currentUserId) =>
  cardData.owner._id === currentUserId;

export const updateLikeView = (cardElement, cardData, currentUserId) => {
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCount = cardElement.querySelector(".card__like-count");

  likeCount.textContent = cardData.likes.length;
  likeButton.classList.toggle(
    "card__like-button_is-active",
    isCardLiked(cardData, currentUserId)
  );
};

export const setDeleteButtonVisibility = (
  cardElement,
  cardData,
  currentUserId
) => {
  const deleteButton = cardElement.querySelector(
    ".card__control-button_type_delete"
  );

  if (!isCardOwner(cardData, currentUserId)) {
    deleteButton.remove();
  }
};

const handleLikeClick = (cardElement, cardData, currentUserId, onLikeIcon) => {
  const liked = isCardLiked(cardData, currentUserId);

  onLikeIcon(cardData._id, liked)
    .then((updatedCard) => {
      cardData.likes = updatedCard.likes;
      updateLikeView(cardElement, cardData, currentUserId);
    })
    .catch((err) => {
      console.log(err);
    });
};

const handleDeleteClick = (cardData, cardElement, onDeleteCard) => {
  onDeleteCard(cardData._id, cardElement);
};

const handleImageClick = (cardData, onPreviewPicture) => {
  onPreviewPicture({ name: cardData.name, link: cardData.link });
};

export const createCardElement = (
  cardData,
  currentUserId,
  { onPreviewPicture, onLikeIcon, onDeleteCard }
) => {
  const cardElement = getTemplate();
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(
    ".card__control-button_type_delete"
  );

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  updateLikeView(cardElement, cardData, currentUserId);
  setDeleteButtonVisibility(cardElement, cardData, currentUserId);

  if (isCardOwner(cardData, currentUserId)) {
    deleteButton.addEventListener("click", () =>
      handleDeleteClick(cardData, cardElement, onDeleteCard)
    );
  }

  likeButton.addEventListener("click", () =>
    handleLikeClick(cardElement, cardData, currentUserId, onLikeIcon)
  );

  cardImage.addEventListener("click", () =>
    handleImageClick(cardData, onPreviewPicture)
  );

  return cardElement;
};
