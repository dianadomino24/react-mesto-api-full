//кейсы проверки валидности
const VALID = 0
const INVALID_EMPTY = 1
const INVALID_TOOSHORT = 2

//скрывает уведомления об ошибках в инпутах (используется на открытом попапе в index.js)
export function cleanInputErrors() {
  const inputErrors = document.querySelectorAll('.popup__input-error')

  if (inputErrors) {
    inputErrors.forEach((error) =>
      error.classList.remove('popup__input-error_active')
    )
  }
}

export class FormValidator {
  constructor(formSelectorsObj, formElement) {
    this._formSelectorsObj = formSelectorsObj
    this._formElement = formElement
    this._inputList = Array.from(
      formElement.querySelectorAll(formSelectorsObj.inputSelector)
    )
    this._buttonElement = formElement.querySelector(
      formSelectorsObj.submitButtonSelector
    )
    this._inactiveButtonClass = formSelectorsObj.inactiveButtonClass
    this._inputErrorClass = formSelectorsObj.inputErrorClass
    this._errorActiveClass = formSelectorsObj.errorActiveClass
    this._controlSelector = formSelectorsObj.controlSelector
  }

  // находит элемент ошибки в ближайшем к текущему инпуту лэйбле
  _findInputError(inputElement) {
    return inputElement
      .closest(this._controlSelector)
      .querySelector(this._inputErrorClass)
  }

  //показывает сообщение об ошибке
  _showInputError(inputElement, errorMessage) {
    const errorElement = this._findInputError(inputElement)
    errorElement.textContent = errorMessage
    errorElement.classList.add(this._errorActiveClass)
  }

  //скрывает сообщение об ошибке
  _hideInputError(inputElement) {
    const errorElement = this._findInputError(inputElement)
    errorElement.classList.remove(this._errorActiveClass)
    errorElement.textContent = ''
  }

  //проверяет длину инпутов, очищенных от пробелов
  _isInputWithoutSpacingInvalid(inputElement) {
    const inputElementNoSpacing = inputElement.value.trim()

    if (inputElementNoSpacing.length === 0) {
      return INVALID_EMPTY
    }
    //если введено меньше 2 символов
    if (inputElementNoSpacing.length < 2) {
      return INVALID_TOOSHORT
    }
    return VALID
  }

  //проверяет валидность инпутов с учетом пробелов и выводит на стр соответствующие ошибки
  _checkInputValidity(inputElement) {
    const errorElement = this._findInputError(inputElement)

    switch (this._isInputWithoutSpacingInvalid(inputElement)) {
      //если поле пусто, не считая пробелы
      case INVALID_EMPTY:
        errorElement.textContent = 'Заполните это поле.'
        errorElement.classList.add(this._errorActiveClass)
        break
      //если выбросить пробелы и в поле 1 символ
      case INVALID_TOOSHORT:
        errorElement.textContent =
          'Текст должен быть не короче 2 симв. Длина текста сейчас: 1 символ.'
        errorElement.classList.add(this._errorActiveClass)
        break
      //если без пробелов в поле 2 символа, то проверим их валидность
      case VALID:
        if (!inputElement.validity.valid) {
          this._showInputError(inputElement, inputElement.validationMessage)
        } else {
          this._hideInputError(inputElement)
        }
        break

      default:
        alert('error')
    }
  }

  //вернет true, если есть невалидный инпут (с учетом проверки пробелов)
  hasInvalidInput() {
    return this._inputList.some((inputElement) => {
      return (
        !inputElement.validity.valid ||
        this._isInputWithoutSpacingInvalid(inputElement)
      )
    })
  }

  //(раз)блокирует кнопку submit, если есть невалидные инпуты
  _toggleButtonState() {
    if (this.hasInvalidInput()) {
      this._buttonElement.classList.add(this._inactiveButtonClass)
    } else {
      this._buttonElement.classList.remove(this._inactiveButtonClass)
    }
  }

  _setEventListeners() {
    //устанавливает состояние кнопки submit еще до изменения инпутов
    this._toggleButtonState()
    //прослушки для инпутов
    this._inputList.forEach((inputElement) => {
      inputElement.addEventListener('input', () => {
        this._checkInputValidity(inputElement)
        this._toggleButtonState()
      })
    })
  }
  enableValidation() {
    this._setEventListeners()
  }
}
