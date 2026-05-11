function showInputError(formElement, inputElement, errorMessage, settings) {
  const errorElement = formElement.querySelector(
    `[data-error-for="${inputElement.name}"]`
  );
  inputElement.classList.add(settings.inputErrorClass);
  if (errorElement) errorElement.textContent = errorMessage;
}

function hideInputError(formElement, inputElement, settings) {
  const errorElement = formElement.querySelector(
    `[data-error-for="${inputElement.name}"]`
  );
  inputElement.classList.remove(settings.inputErrorClass);
  if (errorElement) errorElement.textContent = '';
}

function checkInputValidity(formElement, inputElement, settings) {
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(
      inputElement.dataset.errorMessage || 'Допустимы только буквы, пробелы и дефис.'
    );
  } else {
    inputElement.setCustomValidity('');
  }

  if (!inputElement.validity.valid) {
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      settings
    );
  } else {
    hideInputError(formElement, inputElement, settings);
  }
}

function hasInvalidInput(inputs) {
  return inputs.some((input) => !input.validity.valid);
}

function disableSubmitButton(button, settings) {
  button.disabled = true;
  button.classList.add(settings.inactiveButtonClass);
}

function enableSubmitButton(button, settings) {
  button.disabled = false;
  button.classList.remove(settings.inactiveButtonClass);
}

function toggleButtonState(inputs, button, settings) {
  if (hasInvalidInput(inputs)) {
    disableSubmitButton(button, settings);
  } else {
    enableSubmitButton(button, settings);
  }
}

function setEventListeners(formElement, settings) {
  const inputs = Array.from(
    formElement.querySelectorAll(settings.inputSelector)
  );
  const button = formElement.querySelector(settings.submitButtonSelector);

  toggleButtonState(inputs, button, settings);

  inputs.forEach((input) => {
    input.addEventListener('input', () => {
      checkInputValidity(formElement, input, settings);
      toggleButtonState(inputs, button, settings);
    });
  });
}

export function enableValidation(settings) {
  const forms = Array.from(document.querySelectorAll(settings.formSelector));
  forms.forEach((form) => {
    form.addEventListener('submit', (evt) => evt.preventDefault());
    setEventListeners(form, settings);
  });
}

export function clearValidation(formElement, settings) {
  const inputs = Array.from(
    formElement.querySelectorAll(settings.inputSelector)
  );
  const button = formElement.querySelector(settings.submitButtonSelector);

  inputs.forEach((input) => {
    input.setCustomValidity('');
    hideInputError(formElement, input, settings);
  });

  if (button) {
    disableSubmitButton(button, settings);
  }
}
