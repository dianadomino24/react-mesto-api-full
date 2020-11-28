import React, { useRef } from 'react'
import PopupWithForm from './PopupWithForm'

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {
    const avatarInput = useRef({})

    function handleSubmit(e) {
        onUpdateAvatar({
            avatar: avatarInput.current.value,
        })
    }

    return (
        <PopupWithForm
            title="Обновить аватар"
            name="edit-avatar"
            buttonText="Сохранить"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
        >
            <label className="popup__label">
                <input
                    ref={avatarInput}
                    type="url"
                    name="avatar"
                    id="avatar"
                    placeholder="Ссылка на картинку"
                    className="input popup__input popup__input_type_avatar"
                    required
                />
                <span className="popup__input-error"></span>
            </label>
        </PopupWithForm>
    )
}

export default EditAvatarPopup
