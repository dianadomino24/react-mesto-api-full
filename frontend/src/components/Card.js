import React from 'react'
import { CurrentUserContext } from '../contexts/CurrentUserContext'

export default function Card({
    onCardClick,
    card,
    onCardLike,
    onCardDelete,
    owner,
    likes,
    name,
    link,
}) {
    // будет открывать попап с картинкой
    function handleClick() {
        onCardClick(card)
    }
    function handleLike() {
        onCardLike(card)
    }
    function handleDelete(evt) {
        //сохраняет дом элемент, который надо будет удалить из разметки
        const placeEvt = evt.target.closest('.places__item')
        onCardDelete(card, placeEvt)
    }
    const currentUserData = React.useContext(CurrentUserContext)

    // Определяем, являемся ли мы владельцем текущей карточки
    const isOwn = owner._id === currentUserData._id

    // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
    const isLiked = likes.some((i) => i._id === currentUserData._id)

    // Создаём переменную, которую после зададим в `className` для кнопки лайка
    const cardLikeButtonClassName = isLiked
        ? 'place__like-button place__like-button_active'
        : 'place__like-button'

    return (
        <li className="places__item">
            <figure className="place">
                {/* проверит, моя ли карточка и отключит кнопку удаления у чужих */}
                <button
                    className={
                        isOwn
                            ? 'link place__delete-button'
                            : 'link place__delete-button place__delete-button_disabled'
                    }
                    onClick={handleDelete}
                />
                <img
                    src={link}
                    alt={name}
                    className="place__image"
                    onClick={handleClick}
                />
                <div className="place__wrapper">
                    <h2 className="place__name">{name} </h2>
                    <button className="place__like-button-container">
                        {/* проверит, залайкана ли мной ранее карточка*/}
                        <div
                            className={cardLikeButtonClassName}
                            onClick={handleLike}
                        ></div>
                        <div className="place__like-counter">
                            {likes.length}
                        </div>
                    </button>
                </div>
            </figure>
        </li>
    )
}
