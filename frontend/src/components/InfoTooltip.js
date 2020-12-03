import React from 'react'
import success from '../images/success-icon.svg'
import fail from '../images/fail-icon.svg'

function InfoTooltip({ isOpen, onClose, isSuccess, errorMessage }) {
  // проверяет нажатие esc
  if (isOpen) {
    window.addEventListener('keydown', (evt) => handleEscClose(evt))
  }
  function closeReset() {
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

  return (
    <>
      <section
        className={`popup popup_type_form ${isOpen && 'popup_opened'}`}
        onClick={closePopupByClickingOverlay}
      >
        <div className="popup__container">
          {isSuccess ? (
            <>
              <img
                src={success}
                alt="Галочка"
                className="popup__infotool-img"
              />
              <p className="popup__infotool-text">
                Вы успешно зарегистрировались!
              </p>
            </>
          ) : (
            <>
              <img
                src={fail}
                alt="Красный крестик"
                className="popup__infotool-img"
              />
              <p className="popup__infotool-text">
                {errorMessage || 'Что-то пошло не так. Попробуйте ещё раз!'}
              </p>
            </>
          )}
          <button className="popup__close-button" onClick={onClose}></button>
        </div>
      </section>
    </>
  )
}

export default InfoTooltip
