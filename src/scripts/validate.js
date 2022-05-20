function enableButton(submitButton) {
  submitButton.disabled = false;
}

function disableButton(submitButton) {
  submitButton.disabled = true;
}

function showInputError(inputField, inputErrorClass) {
  inputField.classList.add(inputErrorClass);
}
function hideInputError(inputField, inputErrorClass) {
  inputField.classList.remove(inputErrorClass);
}

function checkInput(inputField, inputErrorClass) {
  const isValid = inputField.checkValidity();

  const errorMessage = inputField
    .closest(".input-group")
    .querySelector(inputField.inputSubtitleErrorClass);
  errorMessage.textContent = inputField.validationMessage;

  if (!isValid) {
    showInputError(inputField, inputErrorClass);
  } else {
    hideInputError(inputField, inputErrorClass);
  }
}

function checkForm(
  form,
  inputSubtitleErrorClass,
  inputSelector,
  formSelector,
  submitsubmitButton
) {
  const inputFields = Array.from(form.querySelectorAll(inputSelector));
  for (let i = 0; i < inputFields.length; i++) {
    const inputField = inputFields[i];
    inputField.inputSubtitleErrorClass = inputSubtitleErrorClass;
    const isValid = inputField.checkValidity();

    const submitButton = inputField
      .closest(formSelector)
      .querySelector(submitsubmitButton);

    if (!isValid) {
      disableButton(submitButton);
      break;
    } else {
      enableButton(submitButton);
    }
  }
}

export function enableValidation(
  formSelector,
  inputSelector,
  submitsubmitButton,
  inputSubtitleErrorClass,
  inputErrorClass
) {
  const forms = Array.from(document.querySelectorAll(formSelector));
  for (let i = 0; i < forms.length; i++) {
    forms[i].addEventListener("input", (event) => {
      checkForm(
        forms[i],
        inputSubtitleErrorClass,
        inputSelector,
        formSelector,
        submitsubmitButton
      );
    });

    const inputs = Array.from(forms[i].querySelectorAll(inputSelector));
    for (let j = 0; j < inputs.length; j++) {
      inputs[j].addEventListener("input", () => {
        checkInput(inputs[j], inputErrorClass);
      });
      inputs[j].inputSubtitleErrorClass = inputSubtitleErrorClass;
    }
  }
}
