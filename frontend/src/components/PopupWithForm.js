import React from 'react'
import { formSelectorsObj } from '../utils/utils'
import { FormValidator } from './FormValidator'

function PopupWithForm({
  title,
  name,
  buttonText,
  isOpen,
  onClose,
  onSubmit,
  children,
}) {
  function formValidate() {
    if (isOpen) {
      const currentForm = document.querySelector(`.popup__form_type_${name}`)
      // будет валидировать форму
      const formValidator = new FormValidator(formSelectorsObj, currentForm)
      formValidator.enableValidation()
      return !formValidator.hasInvalidInput()
    }
  }
  formValidate()

  // очистит форму от введенного в инпут текста, ошибок валидации и закроет попап
  function closeReset() {
    document.querySelector(`.popup__form_type_${name}`).reset()
    onClose()
    window.removeEventListener('keydown', handleEscClose)
  }
  //закрывает при нажатии esc
  function handleEscClose(evt) {
    if (evt.key === 'Escape') {
      closeReset()
    }
  }
  //закрывает попап при нажатии на фон
  function closePopupByClickingOverlay(event) {
    if (event.target === event.currentTarget) {
      closeReset()
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (formValidate()) {
      onSubmit(e)
      document.querySelector(`.popup__form_type_${name}`).reset()
    }
  }
  // проверяет нажатие esc
  if (isOpen) {
    window.addEventListener('keydown', (evt) => handleEscClose(evt))
  }

  return (
    <section
      className={`popup popup_type_form popup_type_${name} ${
        isOpen && 'popup_opened'
      }`}
      onClick={closePopupByClickingOverlay}
    >
      <div className="popup__container">
        <button className="link popup__close-button" onClick={closeReset} />
        <form
          className={`popup__form popup__form_type_${name}`}
          noValidate
          name={name}
          onSubmit={handleSubmit}
        >
          <h2 className="popup__title">{title}</h2>
          <fieldset className="popup__fieldset">
            {children}
            <button
              className={`link popup__save-button popup__save-button_type_${name}`}
              autoFocus
              type="submit"
            >
              {buttonText}
            </button>
          </fieldset>
        </form>
      </div>
    </section>
  )
}

export default PopupWithForm
