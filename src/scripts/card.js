import { openPopup } from "./modal.js";
// import { openImagePopup } from "./modal.js";
// import { testModal } from "./modal.js";

import { deleteCard } from "./api.js";
// import { testDeleting } from "./api.js";
import { giveLike } from "./api.js";
import { removeLike } from "./api.js";
// testModal();

const imagePopup = document.querySelector(".overlay_type_picture");

function turnOnLike(likeButton) {
  likeButton.classList.add("card__heart_selected");
}
function turnOffLike(likeButton) {
  likeButton.classList.remove("card__heart_selected");
}

function toggleLike(likeButton, cardId, likes, counter) {
  if (!likeButton.currentTarget.classList.contains("card__heart_selected")) {
    giveLike(cardId)
      .then((response) => {
        turnOnLike(likeButton.target);
        likes = response.likes.length;
        counter.textContent = likes;
        console.log("likes =", likes);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    // likeButton.currentTarget.classList.add("card__heart_selected");
    return likes;
  } else {
    removeLike(cardId)
      .then((response) => {
        turnOffLike(likeButton.target);
        likes = response.likes.length;
        counter.textContent = likes;
        console.log("likes =", likes);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    // likeButton.currentf.classList.remove("card__heart_selected");
    return likes;
  }
}

function removeCard(card, cardId) {
  console.log("TEST ID =", cardId);
  // testDeleting(cardId).then((response) => {
  //   console.log("testDeleting response =", response);
  // });

  console.log("card =", card);
  deleteCard(cardId)
    .then((response) => {
      card.target.closest(".card").remove();
      console.log("testDeleting response =", response);
      console.log("card =", card);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  console.log(card);
}

const overlayImage = document.querySelector(".overlay__image-popup-photo");
const overlayImageTitle = document.querySelector(".overlay__image-popup-tilte");

function openImagePopup(openButton) {
  overlayImage.setAttribute("src", openButton.currentTarget.src);
  overlayImage.setAttribute("alt", openButton.currentTarget.alt);
  overlayImageTitle.textContent = openButton.currentTarget.alt;
  openPopup(imagePopup);
}

export function createCard(name, url, likes, owned, cardId, ownerId) {
  console.log("createCard cardId =", cardId);
  const cardTemplate = document.querySelector("#card").content;
  const card = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = card.querySelector(".card__image");
  cardImage.setAttribute("src", url);
  cardImage.setAttribute("alt", name);
  const cardTitle = card.querySelector(".card__title");
  cardTitle.textContent = name;
  const likeButton = card.querySelector(".card__heart");
  const counter = card.querySelector(".card__heart-counter");
  for (let i = 0; i < likes.length; i++) {
    console.log(likes[i]._id);
    console.log(ownerId);
    if (likes[i]._id.localeCompare(ownerId) === 0) {
      turnOnLike(card.querySelector(".card__heart"));
    }
  }
  counter.textContent = likes.length;
  likeButton.addEventListener("click", (event) => {
    toggleLike(event, cardId, likes.length, counter);
  });
  if (owned) {
    const deleteButton = card.querySelector(".card__delete-button");
    deleteButton.addEventListener("click", (event) => {
      removeCard(event, cardId);
    });
    deleteButton.setAttribute("style", "display: block");
  }
  const imageButton = card.querySelector(".card__image");
  imageButton.addEventListener("click", openImagePopup);
  return card;
}
