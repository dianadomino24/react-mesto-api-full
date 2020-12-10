import React, { useEffect } from 'react'
import RegisterLoginTemplate from './RegisterLoginTemplate'
import useFormWithValidation from '../hooks/useForm'

const Login = ({ onLogin , onChange }) => {
  const {
    values,
    handleChange,
    errors,
    resetForm,
    isValid,
  } = useFormWithValidation()

  const handleFormChange = (e) => {
    handleChange(e)
    onChange(e)
  }

  useEffect(() => {
    resetForm()
  }, [resetForm])

  const handleSubmit = (e) => {
    e.preventDefault()
    const { email, password } = values
    console.log(email, password)
    onLogin(email, password, resetForm)

  }

  return (
    <div className="login">
      <RegisterLoginTemplate title="Sign in" onSubmit={handleSubmit}>
        <label className="popup__label">
          <input
            type="email"
            value={values.email}
            onChange={handleFormChange}
            name="email"
            placeholder="Email"
            id="email"
            className="input popup__input popup__input_type_dark"
            required
            minLength="2"
            maxLength="80"
          />
          <span className="popup__input-error popup__input-error_active">
            {errors.email}
          </span>
        </label>
        <label className="popup__label">
          <input
            type="password"
            value={values.password}
            onChange={handleFormChange}
            name="password"
            id="password"
            placeholder="Password"
            className="input popup__input popup__input_type_dark"
            required
            minLength="6"
            maxLength="15"
          />
          <span className="popup__input-error popup__input-error_active">
            {errors.password}
          </span>
        </label>
        <button
          className="link popup__save-button popup__save-button_type_dark"
          autoFocus
          type="submit"
          disabled={!isValid}
        >
          Enter
        </button>
      </RegisterLoginTemplate>
    </div>
  )
}

export default Login
