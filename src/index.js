// npm run build; npm run dev

import { enableValidation } from "./scripts/validate.js";

import { createCard } from "./scripts/card.js";

import { openFormOverlay } from "./scripts/modal.js";
import { closePopup } from "./scripts/modal.js";
import { openPopup } from "./scripts/modal.js";
import { toggleLoadingButton } from "./scripts/modal.js";

import { getCards } from "./scripts/api.js";
import { getCardsAndInfo } from "./scripts/api.js";
import { changeProfile } from "./scripts/api.js";
import { addCard } from "./scripts/api.js";
import { updateAvatar } from "./scripts/api.js";

import "./pages/index.css";

let owner;

const profilePopup = document.querySelector(".overlay_type_profile");
const newCardPopup = document.querySelector(".overlay_type_card-add");
const imagePopup = document.querySelector(".overlay_type_picture");
const avatarEditPopup = document.querySelector(".overlay_type_avatar-edit");

const profileAvatar = document.querySelector(".profile__avatar");
const profileName = document.querySelector(".profile__intro-title");
const profileInfo = document.querySelector(".profile__intro-subtitle");
const elements = document.querySelector(".elements");

const inputName = document.querySelector("#overlay__form-input_line-one");
const inputJob = document.querySelector("#overlay__form-input_line-two");

const profilePopupCloseButton = profilePopup.querySelector(
  "#close_profile_button"
);
const newCardPopupCloseButton = newCardPopup.querySelector(
  "#close_card-add_button"
);
const imagePopupCloseButton = imagePopup.querySelector("#close_picture_button");
const avatarEditPopupCloseButton = avatarEditPopup.querySelector(
  "#close_avatar-edit_button"
);

getCardsAndInfo()
  .then((response) => {
    // owner = response[1].name;
    owner = response[1]._id;

    for (let i = 0; i < response[0].length; i++) {
      // console.log("card owner =", result[i].owner);
      // let likes = response[0][i].likes.length;
      let owned = false;
      // let id = response[0][i]._id;
      // console.log("CardId (?) =", id);
      // console.log(owner, " ", response[0][i].owner.name);
      if (owner === response[0][i].owner._id) {
        owned = true;
      }
      const card = createCard(
        response[0][i].name,
        response[0][i].link,
        response[0][i].likes,
        owned,
        response[0][i]._id,
        owner
      );
      elements.prepend(card);
    }
    console.log("cardsData =", response[0]);

    profileName.textContent = response[1].name;
    profileInfo.textContent = response[1].about;
    // console.log("owner =", owner);
    profileAvatar.setAttribute("src", response[1].avatar);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

const inputCardName = document.querySelector(
  "#overlay__form-new-card-name-input"
);
const inputCardImageUrl = document.querySelector(
  "#overlay__form-new-card-url-input"
);
const inputProfileImage = document.querySelector(
  "#overlay__form-new-profile-image-input"
);

profilePopupCloseButton.addEventListener("click", () => {
  closePopup();
});
newCardPopupCloseButton.addEventListener("click", () => {
  closePopup();
});
imagePopupCloseButton.addEventListener("click", () => {
  closePopup();
});
avatarEditPopupCloseButton.addEventListener("click", () => {
  closePopup();
});

const editProfileForm = document.querySelector("#edit_form");
const addForm = document.querySelector("#add_form");
const avatarEditForm = document.querySelector("#avatar_edit_form");

function openProfilePopup(profilePopup) {
  openFormOverlay(profilePopup);
  inputName.value = profileName.textContent;
  inputJob.value = profileInfo.textContent;
  openPopup(profilePopup);
}

function openNewCardPopup(newCardPopup) {
  openFormOverlay(newCardPopup);
  openPopup(newCardPopup);
}

function openAvatarEditPopup(avatarEditPopup) {
  openFormOverlay(avatarEditPopup);
  openPopup(avatarEditPopup);
}

function submitTitleChanges(event) {
  event.preventDefault();
  const submitButton = event.submitter;
  toggleLoadingButton(submitButton, "Сохранение...");
  changeProfile(profileName.textContent, profileInfo.textContent)
    .then((response) => {
      profileName.textContent = inputName.value;
      profileInfo.textContent = inputJob.value;
      closePopup();
      toggleLoadingButton(submitButton, "Сохранить");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  // closePopup();
}

function submitCardCreation(event) {
  event.preventDefault();
  const submitButton = event.submitter;
  toggleLoadingButton(submitButton, "Создание...");
  addCard(inputCardName.value, inputCardImageUrl.value)
    .then((response) => {
      const newCardId = response._id;
      console.log("added card id =", response._id);
      console.log("TEST =", newCardId);
      const card = createCard(
        inputCardName.value,
        inputCardImageUrl.value,
        0,
        true,
        newCardId
      );
      elements.prepend(card);
      closePopup();
      // toggleLoadingButton(submitButton, "Создать");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function submitUpdateAvatar(event) {
  event.preventDefault();
  const submitButton = event.submitter;
  toggleLoadingButton(submitButton, "Сохранение...");
  updateAvatar(inputProfileImage.value)
    .then((response) => {
      closePopup();
      toggleLoadingButton(submitButton, "Сохранить");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

editProfileForm.addEventListener("submit", submitTitleChanges, true);
addForm.addEventListener("submit", submitCardCreation, true);
avatarEditForm.addEventListener("submit", submitUpdateAvatar, true);

const editButton = document.querySelector(".profile__edit-button");
const addButton = document.querySelector(".profile__add-button");
const editAvatarButton = document.querySelector(".profile__avatar-overlay");

editButton.addEventListener("click", function () {
  openProfilePopup(profilePopup);
});
addButton.addEventListener("click", function () {
  openNewCardPopup(newCardPopup);
});
editAvatarButton.addEventListener("click", function () {
  openAvatarEditPopup(avatarEditPopup);
});

enableValidation(
  ".overlay__form",
  ".overlay__form-input",
  ".overlay__form-button",
  ".overlay__form-error",
  "overlay__form-input_error"
);

// changeProfile("Marie Skłodowska Curie", "Physicist and Chemist").then(
// changeProfile("ffffsdfsdf sdf sdf", "Physicist and Chemist").then((result) => {
//   console.log("changeProfile =", result);
// });
// addCard().then((result) => {
//   console.log("addCard =", result);
// });
