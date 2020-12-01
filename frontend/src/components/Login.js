import React, { useState } from 'react'
import RegisterLoginTemplate from './RegisterLoginTemplate'

const Login = ({ onLogin, message, loggedIn }) => {
  const [data, setData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const { email, password } = data

    if (!email || !password) {
      return
    }
    onLogin(email, password)
  }

  React.useEffect(() => {
    if (loggedIn) {
      setData({ email: '', password: '' })
    }
  }, [loggedIn])

  return (
    <div className="login">
      <RegisterLoginTemplate title="Вход" onSubmit={handleSubmit}>
        <label className="popup__label">
          <input
            type="email"
            value={data.email}
            onChange={handleChange}
            name="email"
            placeholder="Email"
            id="email"
            className="input popup__input popup__input_type_dark"
            required
            minLength="2"
            maxLength="320"
          />
          <span className="popup__input-error">{message}</span>
        </label>
        <label className="popup__label">
          <input
            type="password"
            value={data.password}
            onChange={handleChange}
            name="password"
            id="password"
            placeholder="Пароль"
            className="input popup__input popup__input_type_dark"
            required
            minLength="2"
            maxLength="200"
          />
          <span className="popup__input-error">{message}</span>
        </label>
        <button
          className="link popup__save-button popup__save-button_type_dark"
          autoFocus
          type="submit"
        >
          Войти
        </button>
      </RegisterLoginTemplate>
    </div>
  )
}

export default Login
