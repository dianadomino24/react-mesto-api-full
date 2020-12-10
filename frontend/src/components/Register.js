import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import RegisterLoginTemplate from './RegisterLoginTemplate'
import useFormWithValidation from '../hooks/useForm'

const Register = ({ onRegister }) => {
  const {
    values,
    handleChange,
    errors,
    resetForm,
    isValid,
  } = useFormWithValidation()

  const handleFormChange = (e) => {
    handleChange(e)
  }
  // useEffect(() => {
  //   resetForm()
  // }, [resetForm])

  const handleSubmit = (e) => {
    e.preventDefault()
    const { email, password } = values
    onRegister(email, password)
    resetForm()
  }

  return (
    <div className="register">
      <RegisterLoginTemplate title="Sign up" onSubmit={handleSubmit}>
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
          Sign up
        </button>
        <Link to="/sign-in" className="link popup__login-link">
          Already signed up? Then enter.
        </Link>
      </RegisterLoginTemplate>
    </div>
  )
}

export default Register
