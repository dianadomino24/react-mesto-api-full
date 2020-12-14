import { useState, useCallback } from 'react'

export default function useFormWithValidation() {
  const [values, setValues] = useState({})
  const [errors, setErrors] = useState({})
  const [isValid, setIsValid] = useState(false)

  const handleChange = (evt) => {
    const target = evt.target
    const name = target.name
    if (name == 'password') {
      const value = target.value.trim().replace(/\s/g,'')
      console.log('value', value)
      setValues({ ...values, [name]: value })
      setErrors({ ...errors, [name]: target.validationMessage })
    } else {
      const value = target.value.trim()
      console.log('value name', value)
      setValues({ ...values, [name]: value })
      setErrors({ ...errors, [name]: target.validationMessage })
    }
    setIsValid(evt.target.closest('form').checkValidity())

}
  const resetForm = useCallback(() => {
    setValues({})
    setErrors({})
    setIsValid(false)
  }, [])

  return { values, setValues, handleChange, errors, resetForm, isValid }
}
