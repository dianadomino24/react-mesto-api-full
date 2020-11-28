import React from 'react'
import PopupWithForm from './PopupWithForm'

function PopupWithSubmit({
    title,
    name,
    card,
    cardDOM,
    buttonText,
    isOpen,
    onClose,
    onCardDeleteSubmit,
}) {
    function handleSubmit(e) {
        // Запрещаем браузеру переходить по адресу формы
        e.preventDefault()
        onCardDeleteSubmit(card, cardDOM)
    }
    return (
        <PopupWithForm
            title={title}
            name={name}
            buttonText={buttonText}
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
        ></PopupWithForm>
    )
}

export default PopupWithSubmit
