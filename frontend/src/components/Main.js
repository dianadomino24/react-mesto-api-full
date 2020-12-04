import React from 'react'
import Card from './Card'
import { CurrentUserContext } from '../contexts/CurrentUserContext'

function Main({
  onEditProfile,
  onAddPlace,
  onEditAvatar,
  handleCardClick,
  cards,
  onCardLike,
  onCardDelete,
  ...rest
}) {
  const currentUserData = React.useContext(CurrentUserContext)

  return (
    <main className="content page__content section">
      <section className="profile section">
        <div
          className="profile__image"
          onClick={onEditAvatar}
          style={{
            backgroundImage: `url(${currentUserData.avatar})`,
          }}
        ></div>
        <div className="profile__info">
          <div className="profile__name-wrap">
            <h1 className="profile__name">{currentUserData.name}</h1>
            <button
              className="link profile__edit-button"
              onClick={onEditProfile}
            />
          </div>
          <p className="profile__job">{currentUserData.about}</p>
        </div>
        <button className="link profile__add-button" onClick={onAddPlace} />
      </section>
      <section className="places section">
        <ul className="places__list">
          <li className="places__empty-list">No places added</li>
          {cards.map((card) => (
            <Card
              key={card._id}
              onCardClick={handleCardClick}
              card={card}
              onCardLike={onCardLike}
              onCardDelete={onCardDelete}
              {...card}
            />
          ))}
        </ul>
      </section>
    </main>
  )
}

export default Main

// // для проверки, есть ли в списке картинки, если нет, то делает видимой надпись о пустом списке
// //в placesList всегда есть минимум 1 элемент - надпись о пустом списке
// function check() {
//     const placesList = document.querySelector('.places__list')
//     return (placesList.children.length === 1? "places__empty-list places__empty-list_visible" : "places__empty-list")
// }
