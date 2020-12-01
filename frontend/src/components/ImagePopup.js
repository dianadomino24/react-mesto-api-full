import React from 'react'

function ImagePopup({ card, onClose, isOpen, name }) {
  function close() {
    onClose()
    window.removeEventListener('keydown', handleEscClose)
  }
  //закрывает при нажатии esc
  function handleEscClose(evt) {
    if (evt.key === 'Escape') {
      close()
    }
  }
  //закрывает попап при нажатии на фон
  function closePopupByClickingOverlay(event) {
    if (event.target === event.currentTarget) {
      close()
    }
  }
  if (isOpen) {
    window.addEventListener('keydown', handleEscClose)
  }

  return (
    <section
      className={`popup popup_type_${name} ${isOpen && 'popup_opened'}
                `}
      onClick={closePopupByClickingOverlay}
    >
      <div className="popup__container-pic-zoom">
        <button className="link popup__close-button" onClick={close} />
        <figure className="picture-zoom">
          <img
            src={card ? card.link : ''}
            alt={card ? card.name : ''}
            className="picture-zoom__img"
          />
          <p className="picture-zoom__title">{card ? card.name : ''}</p>
        </figure>
      </div>
    </section>
  )
}

export default ImagePopup
