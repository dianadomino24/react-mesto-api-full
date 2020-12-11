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

function App() {
  //popups states
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false)
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false)
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false)
  const [isCardDeletePopupOpen, setIsCardDeletePopupOpen] = useState(false)
  const [isImgPopupOpen, setIsImgPopupOpen] = useState(false)
  const [isInfoTooltipOpen, setInfoTooltipOpen] = useState(false)

  const [cards, setCards] = useState([])

  const profileAvatarSelector = '.profile__image'
  // Current user data (will show Jacques-Yves Cousteau before getting data from remote server)
  const [currentUser, setCurrentUser] = useState({
    name: 'Jacques-Yves Cousteau',
    about: 'Navigator',
    avatar:
      'https://kaskad.tv/images/2020/foto_zhak_iv_kusto__-_interesnie_fakti_20190810_2078596433.jpg',
  })
  // used for full-size picture popup
  const [selectedCard, setSelectedCard] = useState()
  // used for card deleteing
  const [selectedCardDOM, setSelectedCardDOM] = useState()

  const [userEmail, setUserEmail] = useState({ email: '' })
  const [loggedIn, setLoggedIn] = useState(false)
  const history = useHistory()
  const [errorMessage, setErrorMessage] = useState('')
  // for showing registration/login success state
  const [registerSuccess, setRegisterSuccess] = useState(false)

  // open popups
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

  // on mounting will fetch api data on user and cards
  useEffect(() => {
    Promise.all([api.getItems('/users/me'), api.getItems('/cards')])
      .then((values) => {
        const [userData, serverCards] = values

        setCurrentUser(userData)

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
        console.log(`When loading user and cards data: ${err}`)
      })
  }, [loggedIn])

  // options for button text to show when data is being sent to server
  const loadingText = 'Saving...'
  const defaultSaveText = 'Save'
  const defaultCreateText = 'Create'
  const defaultYesText = 'Yes'
  // replaces button text when loading data to server
  function renderLoading(isLoading, button, text) {
    if (isLoading) {
      button.textContent = loadingText
    } else {
      button.textContent = text
    }
  }
  function handleCardLike(card) {
    // checks if like has already been put
    const isLiked = card.likes.some((id) => id === currentUser._id)

    // fetch new data about card state
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        // form a new array of cards with liked one
        const newCards = cards.map((c) => (c._id === card._id ? newCard : c))
        setCards(newCards)
      })
      .catch((err) => {
        console.log(`On card like: ${err}`)
      })
  }

  function handleCardDeleteSubmit(card, cardDOMElement) {
    const cardDeleteSubmitButton = document.querySelector(
      '.popup__save-button_type_card-delete'
    )
    // show loading process
    renderLoading(true, cardDeleteSubmitButton, defaultYesText)
    api
      .deleteItem('/cards', card._id)
      .then(() => {
        // deletes card from DOM
        cardDOMElement.remove()
      })
      .then(() => {
        closeAllPopups()
      })
      .catch((err) => {
        console.log(`On card delete: ${err}`)
      })
      .finally(() =>
        renderLoading(false, cardDeleteSubmitButton, defaultYesText)
      )
  }

  function handleCardDelete(card, cardDOMElement) {
    setIsCardDeletePopupOpen(true)
    setSelectedCard(card)
    setSelectedCardDOM(cardDOMElement)
  }

  function handleUpdateUser(userData) {
    const profileSubmitButton = document.querySelector(
      '.popup__save-button_type_edit-profile'
    )

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
        setCurrentUser(res)
      })
      .then(() => {
        closeAllPopups()
      })
      .catch((err) => {
        console.log(`On user data update: ${err}`)
      })
      .finally(() => {
        renderLoading(false, profileSubmitButton, defaultSaveText)
      })
  }

  function handleUpdateAvatar(userData) {
    const avatarSubmitButton = document.querySelector(
      '.popup__save-button_type_edit-avatar'
    )
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
        console.log(`On avatar change: ${err}`)
      })
      .finally(() => {
        renderLoading(false, avatarSubmitButton, defaultSaveText)
      })
  }
  // adds new card
  function handleAddPlaceSubmit(newCard) {
    const placeSubmitButton = document.querySelector(
      '.popup__save-button_type_add-place'
    )
    renderLoading(true, placeSubmitButton, defaultCreateText)

    api
      .createItem(newCard, '/cards')
      .then((newCard) => {
        setCards([newCard, ...cards])
      })
      .then(() => {
        closeAllPopups()
      })
      .catch((err) => {
        console.log(`On card add: ${err}`)
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

  // const setUser = (evt) => {
  //   const target = evt.target;
  //   const name = target.name;
  //   const value = target.value;
  // };

  function handleLogin(email, password, resetForm) {
    auth
      .authorize(email, password)
      .then((data) => {
        if (!data) {
          setErrorMessage('Something went wrong on authorization')
          return false
        }
        if (data.token) {
          setToken(data.token)
          setErrorMessage('')
          resetForm()
          setUserEmail({ email: email })
          setLoggedIn(true)
          history.push('/')
          return loggedIn
        }
      })
      .catch((err) => {
        setErrorMessage(`Error: ${err.message}`)
        handleRegisterFail()
        infoTooltipOpen()
        if (err.status === 401) {
          return console.log(`User with this email is not found : ${err}`)
        }
        if (err.status === 400) {
          return console.log(`One of the inputs is not filled in : ${err}`)
        }
        console.log(`App authorize Error: ${err.message}`)
      })
  }
  function handleRegisterSuccess() {
    setRegisterSuccess(true)
  }
  function handleRegisterFail() {
    setRegisterSuccess(false)
  }

  function handleRegister(email, password, resetForm) {
    auth
      .register(email, password)
      .then((res) => {
        if (res) {
          setErrorMessage('')
          resetForm()
          handleRegisterSuccess()
          infoTooltipOpen()
          history.push('/sign-in')
        }
      })
      .catch((err) => {
        setErrorMessage(`Error: ${err.message}`)
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
  // will check token on element mounting and route changing
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
              <Login onLogin={handleLogin} />
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
            title="Are you sure?"
            name="card-delete"
            card={selectedCard}
            cardDOM={selectedCardDOM}
            buttonText="Yes"
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
