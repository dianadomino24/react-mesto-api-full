import React, { useEffect, useState } from 'react'
import api from '../utils/api'
import Header from './Header'
import Main from './Main'
import Footer from './Footer'
import PopupWithSubmit from './PopupWithSubmit'
import ImagePopup from './ImagePopup'
import { CurrentUserContext } from '../contexts/CurrentUserContext'
import EditProfilePopup from './EditProfilePopup'
import EditAvatarPopup from './EditAvatarPopup'
import AddPlacePopup from './AddPlacePopup'
import { cleanInputErrors } from './FormValidator'
import { Route, Switch, useHistory } from 'react-router-dom'
import Login from './Login'
import ProtectedRoute from './ProtectedRoute'
import Register from './Register'
import InfoTooltip from './InfoTooltip'
import * as auth from '../utils/auth.js'
import { getToken, removeToken } from '../utils/token'
import { setToken } from '../utils/token'

const TOKEN_KEY = 'jwt'


function App() {
  //состояние попапов
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false)
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false)
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false)
  const [isCardDeletePopupOpen, setIsCardDeletePopupOpen] = useState(false)
  const [isImgPopupOpen, setIsImgPopupOpen] = useState(false)
  const [isInfoTooltipOpen, setInfoTooltipOpen] = useState(false)

  const [cards, setCards] = useState([])

  const profileAvatarSelector = '.profile__image'
  // Данные текущего пользователя будут использованы как контекст (пока не пришли даннные с сервера покажет Жака)
  const [currentUser, setCurrentUser] = useState({
    name: 'Жак Ив Кусто',
    about: 'Мореплаватель',
    avatar:
      'https://kaskad.tv/images/2020/foto_zhak_iv_kusto__-_interesnie_fakti_20190810_2078596433.jpg',
  })
  // для попапа с полноразмерной картинкой
  const [selectedCard, setSelectedCard] = useState()
  // для удаления карточки
  const [selectedCardDOM, setSelectedCardDOM] = useState()

  const [userEmail, setUserEmail] = useState({ email: '' })
  const [loggedIn, setLoggedIn] = useState(false)
  const history = useHistory()
  const [errorMessage, setErrorMessage] = useState('')
  // для показа (не)успешной регистрации
  const [registerSuccess, setRegisterSuccess] = useState(false)

  // открывают попапы
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true)
  }
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true)
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true)
  }

  //для открытия попапа с увеличенной картинкой
  function handleCardClick(card) {
    setSelectedCard(card)
    setIsImgPopupOpen(true)
  }

  // закрывает все попапы меняя их состояние
  function closeAllPopups() {
    //убирает уведомления об ошибках от предыдущих инпутов
    cleanInputErrors()

    setIsEditAvatarPopupOpen(false)
    setIsEditProfilePopupOpen(false)
    setIsAddPlacePopupOpen(false)
    setIsCardDeletePopupOpen(false)
    setIsImgPopupOpen(false)
    setInfoTooltipOpen(false)
  }

  // при монтировании компонента будет совершать запрос в API за пользовательскими данными и карточками
  useEffect(() => {
    Promise.all([api.getItems('/users/me'), api.getItems('/cards')])
      .then((values) => {
        const [userData, serverCards] = values
        // отображает данные пользователья в профиле
        setCurrentUser(userData)

        // отобразит карточки с сервера
        const items = serverCards.map((item) => ({
          name: item.name,
          link: item.link,
          _id: item._id,
          likes: item.likes,
          owner: item.owner,
        }))
        setCards(items)
      })
      .catch((err) => {
        console.log(`Загрузка информации о пользователе и карточках: ${err}`)
      })
  }, [loggedIn])

  // варианты замены текста кнопок при ожидании загрузки
  const loadingText = 'Сохранение...'
  const defaultSaveText = 'Сохранить'
  const defaultCreateText = 'Создать'
  const defaultYesText = 'Да'
  // заменит текст кнопок при ожидании процесса загрузки данных на сервер
  function renderLoading(isLoading, button, text) {
    if (isLoading) {
      button.textContent = loadingText
    } else {
      button.textContent = text
    }
  }
  function handleCardLike(card) {
    // проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((id) => id === currentUser._id)

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        // Формируем новый массив на основе имеющегося, подставляя в него новую карточку
        const newCards = cards.map((c) => (c._id === card._id ? newCard : c))
        // Обновляем стейт
        setCards(newCards)
      })
      .catch((err) => {
        console.log(`Изменения статуса лайка: ${err}`)
      })
  }

  function handleCardDeleteSubmit(card, cardDOMElement) {
    const cardDeleteSubmitButton = document.querySelector(
      '.popup__save-button_type_card-delete'
    )
    // ожидание загрузки
    renderLoading(true, cardDeleteSubmitButton, defaultYesText)
    api
      .deleteItem('/cards', card._id)
      .then(() => {
        //вызывает удаление карточки из разметки
        cardDOMElement.remove()
      })
      .then(() => {
        closeAllPopups()
      })
      .catch((err) => {
        console.log(`При удалении карточки: ${err}`)
      })
      .finally(() =>
        renderLoading(false, cardDeleteSubmitButton, defaultYesText)
      )
  }
  // удаляет карточку
  function handleCardDelete(card, cardDOMElement) {
    setIsCardDeletePopupOpen(true)
    setSelectedCard(card)
    setSelectedCardDOM(cardDOMElement)
  }
  // обновляет профиль
  function handleUpdateUser(userData) {
    const profileSubmitButton = document.querySelector(
      '.popup__save-button_type_edit-profile'
    )
    // ожидание загрузки
    renderLoading(true, profileSubmitButton, defaultSaveText)

    api
      .changeItem(
        {
          name: userData.name.trim(),
          about: userData.about.trim(),
        },
        '/users/me'
      )
      .then((res) => {
        //установим новые данные профиля в разметке
        setCurrentUser(res)
      })
      .then(() => {
        closeAllPopups()
      })
      .catch((err) => {
        console.log(`При обновлении информации о пользователе: ${err}`)
      })
      .finally(() => {
        renderLoading(false, profileSubmitButton, defaultSaveText)
      })
  }

  function handleUpdateAvatar(userData) {
    const avatarSubmitButton = document.querySelector(
      '.popup__save-button_type_edit-avatar'
    )
    // до получения ответа от сервера покажет пользователю надпись о процессе загрузки
    renderLoading(true, avatarSubmitButton, defaultSaveText)

    api
      .changeItem({ avatar: userData.avatar }, '/users/me/avatar')
      .then((res) => {
        //установим новые данные профиля
        setCurrentUser(res)
        // установим новый аватар в разметке
        document.querySelector(
          profileAvatarSelector
        ).style.backgroundImage = `url('${res.avatar}')`
      })
      .then(() => {
        closeAllPopups()
      })
      .catch((err) => {
        console.log(`При изменении аватара пользователя: ${err}`)
      })
      .finally(() => {
        renderLoading(false, avatarSubmitButton, defaultSaveText)
      })
  }
  // добавит новую карточку места
  function handleAddPlaceSubmit(newCard) {
    const placeSubmitButton = document.querySelector(
      '.popup__save-button_type_add-place'
    )
    // до получения ответа от сервера покажет пользователю надпись о процессе загрузки
    renderLoading(true, placeSubmitButton, defaultCreateText)

    api
      .createItem(newCard, '/cards')
      // создаст ее в разметке
      .then((newCard) => {
        setCards([newCard, ...cards])
      })
      .then(() => {
        closeAllPopups()
      })
      .catch((err) => {
        console.log(`Добавление карточки: ${err}`)
      })
      .finally(() => {
        renderLoading(false, placeSubmitButton, defaultCreateText)
      })
  }

  function infoTooltipOpen() {
    setInfoTooltipOpen(true)
  }

  function onSignOut() {
    removeToken()
    setLoggedIn(false)
    history.push('/sign-in')
  }

  function handleLogin(email, password) {
    auth
      .authorize(email, password)
      .then((data) => {
        if (!data) {
          setErrorMessage('Что-то пошло не так при авторизации.')
          return false
        }
        if (data.token) {
          setToken(data.token)
          setErrorMessage('')

          setUserEmail({ email: email })
          setLoggedIn(true)
          history.push('/')
          return loggedIn
        }
      })
      .catch((err) => {
        setErrorMessage(`Ошибка: ${err.message}`)
        handleRegisterFail()
        infoTooltipOpen()
        if (err.status === 401) {
          return console.log(`Пользователь с email не найден : ${err}`)
        }
        if (err.status === 400) {
          return console.log(`Не передано одно из полей : ${err}`)
        }
        console.log(`App authorize Error: ${err}`)
      })
  }
  function handleRegisterSuccess() {
    setRegisterSuccess(true)
  }
  function handleRegisterFail() {
    setRegisterSuccess(false)
  }

  function handleRegister(email, password) {
    auth
      .register(email, password)
      .then((res) => {
        if (res) {
          setErrorMessage('')
          handleRegisterSuccess()
          infoTooltipOpen()
          history.push('/sign-in')
        }
      })
      .catch((err) => {
        setErrorMessage(`Ошибка: ${err.message}`)
        handleRegisterFail()
        infoTooltipOpen()
        console.log(`App onRegister: ${err.message}`)
      })
  }

  const tokenCheck = () => {
    const jwt = getToken()

    if (!jwt) {
      return
    }

    auth
      .getContent(jwt)
      .then((res) => {
        if (res) {
          const userCurrentEmail = {
            email: res.email,
          }
          setLoggedIn(true)
          setUserEmail(userCurrentEmail)
          history.push('/')
        }
      })
      .catch((err) => {
        console.log(`getContent: ${err}`)
      })
  }
  // при монтировании компонента и переключениях рута будет проверять токен
  useEffect(() => {
    tokenCheck()
  }, [loggedIn, history])

  return (
    <div className="page">
      <div className="page__container">
        <CurrentUserContext.Provider value={currentUser}>
          <Header onSignOut={onSignOut} userEmail={userEmail} />
          <Switch>
            <Route path="/sign-up">
              <Register onRegister={handleRegister} />
            </Route>
            <Route path="/sign-in">
              <Login
                onLogin={handleLogin}
                loggedIn={loggedIn}
              />
            </Route>

            <ProtectedRoute
              path="/"
              loggedIn={loggedIn}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              handleCardClick={handleCardClick}
              cards={cards}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
              component={Main}
            />
          </Switch>

          {loggedIn && <Footer />}
          <InfoTooltip
            isOpen={isInfoTooltipOpen}
            onClose={closeAllPopups}
            isSuccess={registerSuccess}
            errorMessage={errorMessage}
          />
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          />

          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
          />

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />

          <PopupWithSubmit
            title="Вы уверены?"
            name="card-delete"
            card={selectedCard}
            cardDOM={selectedCardDOM}
            buttonText="Да"
            isOpen={isCardDeletePopupOpen}
            onClose={closeAllPopups}
            onCardDeleteSubmit={handleCardDeleteSubmit}
          ></PopupWithSubmit>

          <ImagePopup
            name="picture-zoom"
            isOpen={isImgPopupOpen}
            card={selectedCard}
            onClose={closeAllPopups}
          />
        </CurrentUserContext.Provider>
      </div>
    </div>
  )
}

export default App
