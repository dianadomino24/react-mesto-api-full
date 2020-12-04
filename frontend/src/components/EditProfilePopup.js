import React, { useState, useEffect } from 'react'
import PopupWithForm from './PopupWithForm'
import { CurrentUserContext } from '../contexts/CurrentUserContext'

function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
  const currentUser = React.useContext(CurrentUserContext)

  // для заполнения инпутов текущими данными пользователя
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  // После загрузки текущего пользователя из API
  // его данные будут использованы в управляемых компонентах.
  useEffect(() => {
    setName(currentUser.name)
    setDescription(currentUser.about)
  }, [currentUser])
  // при введении текста в инпут будет обновлять стейт
  function handleNameChange(e) {
    setName(e.target.value)
  }
  function handleDescribChange(e) {
    setDescription(e.target.value)
  }

  function handleClose() {
    setName(currentUser.name)
    setDescription(currentUser.about)

    onClose()
  }

  function handleSubmit(e) {
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault()

    // Передаём значения управляемых компонентов во внешний обработчик
    onUpdateUser({
      name,
      about: description,
    })
  }

  return (
    <PopupWithForm
      title="Update profile info"
      name="edit-profile"
      buttonText="Save"
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
    >
      <label className="popup__label">
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          name="profile-name"
          placeholder="Name"
          id="profile-name"
          className="input popup__input popup__input_type_name"
          required
          minLength="2"
          maxLength="40"
        />
        <span className="popup__input-error js-popup__input-error_type_profile"></span>
      </label>
      <label className="popup__label">
        <input
          type="text"
          value={description}
          onChange={handleDescribChange}
          name="profile-job"
          id="profile-job"
          placeholder="Job"
          className="input popup__input popup__input_type_job"
          required
          minLength="2"
          maxLength="200"
        />
        <span className="popup__input-error js-popup__input-error_type_profile"></span>
      </label>
    </PopupWithForm>
  )
}

export default EditProfilePopup
