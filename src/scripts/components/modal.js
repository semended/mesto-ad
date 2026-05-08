const OPEN_CLASS = 'popup_is-opened';

function handleEscape(evt) {
  if (evt.key === 'Escape') {
    const opened = document.querySelector(`.${OPEN_CLASS}`);
    if (opened) closeModal(opened);
  }
}

export function openModal(popup) {
  popup.classList.add(OPEN_CLASS);
  document.addEventListener('keydown', handleEscape);
}

export function closeModal(popup) {
  popup.classList.remove(OPEN_CLASS);
  document.removeEventListener('keydown', handleEscape);
}

export function setupOverlayAndCloseHandlers(popup) {
  popup.addEventListener('mousedown', (evt) => {
    if (evt.target === popup) closeModal(popup);
    if (evt.target.classList.contains('popup__close')) closeModal(popup);
  });
}
