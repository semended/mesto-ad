const getTemplate = () => {
  return document
    .getElementById("card-template")
    .content.querySelector(".card")
    .cloneNode(true);
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
  const likeCount = cardElement.querySelector(".card__like-count");
  const deleteButton = cardElement.querySelector(
    ".card__control-button_type_delete"
  );

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likeCount.textContent = cardData.likes.length;

  const isOwner = cardData.owner._id === currentUserId;
  if (!isOwner) {
    deleteButton.remove();
  } else {
    deleteButton.addEventListener("click", () => {
      onDeleteCard(cardData._id, cardElement);
    });
  }

  const isLikedByMe = cardData.likes.some((user) => user._id === currentUserId);
  if (isLikedByMe) {
    likeButton.classList.add("card__like-button_is-active");
  }

  likeButton.addEventListener("click", () => {
    const isLiked = likeButton.classList.contains(
      "card__like-button_is-active"
    );
    onLikeIcon(cardData._id, isLiked)
      .then((updatedCard) => {
        likeButton.classList.toggle("card__like-button_is-active");
        likeCount.textContent = updatedCard.likes.length;
      })
      .catch((err) => {
        console.log(err);
      });
  });

  cardImage.addEventListener("click", () => {
    onPreviewPicture({ name: cardData.name, link: cardData.link });
  });

  return cardElement;
};
