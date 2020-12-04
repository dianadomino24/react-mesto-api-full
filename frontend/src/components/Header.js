import React from 'react'
import logoPath from '../images/logo.svg'
import { Route, Switch, Link } from 'react-router-dom'

function Header({ onSignOut, userEmail }) {
  const { email } = userEmail
  return (
    <header className="header page__header section">
      <a href="/" className="logo header__logo">
        <img
          className="logo__image"
          src={logoPath}
          alt="Logo of project Mesto"
        />
      </a>
      <Switch>
        <Route path="/sign-up">
          <Link to="./sign-in" className="link header__link">
            Sign in
          </Link>
        </Route>
        <Route path="/sign-in">
          <Link to="./sign-up" className="link header__link">
            Sign up
          </Link>
        </Route>
        <Route path="/">
          <div className="header__user-info">
            <p className="header__email">{email}</p>
            <button onClick={onSignOut} className="header__button">
              Quit
            </button>
          </div>
        </Route>
      </Switch>
    </header>
  )
}

export default Header
