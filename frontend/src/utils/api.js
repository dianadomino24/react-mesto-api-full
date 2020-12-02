import { BASE_URL } from './utils'

class Api {
  constructor({ baseUrl, headers }) {
    this.baseUrl = baseUrl
    this.headers = headers
  }

  _getResponseData(res) {
    if (res.ok) {
      return res.json()
    }
    return Promise.reject(new Error(`Ошибка: ${res.status}`))
  }

  getItems(label) {
    return fetch(this.baseUrl.concat(label), {
      headers: this.headers,
    }).then((res) => this._getResponseData(res))
  }

  createItem(item, label) {
    return fetch(this.baseUrl.concat(label), {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(item),
    }).then((res) => this._getResponseData(res))
  }

  changeItem(item, title) {
    return fetch(this.baseUrl.concat(title), {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(item),
    }).then((res) => this._getResponseData(res))
  }

  changeLikeCardStatus(cardId, notLiked) {
    if (notLiked) {
      return this.replaceItem('/cards/likes', cardId)
    }
    return this.deleteItem('/cards/likes', cardId)
  }

  replaceItem(title, id) {
    return fetch(this.baseUrl.concat(title).concat(`/${id}`), {
      method: 'PUT',
      headers: this.headers,
      // body: JSON.stringify(item)
    }).then((res) => this._getResponseData(res))
  }

  deleteItem(title, id) {
    return fetch(this.baseUrl.concat(title).concat(`/${id}`), {
      method: 'DELETE',
      headers: this.headers,
    }).then((res) => this._getResponseData(res))
  }
}

// const token = '3829caf2-6683-412f-9e00-d0870fcd1817'
// const cohort = 'cohort-14'

const api = new Api({
  baseUrl: BASE_URL,
  headers: {
    Accept: 'application/json',
    authorization: `Bearer ${localStorage.getItem('jwt')}`,
    'Content-Type': 'application/json',
  },
})

export default api

//  - получить список всех карточек в виде массива (GET)
//  - добавить карточку (POST)
//  - удалить карточку (DELETE)
//  - получить данные пользователя (GET)
//  - заменить данные пользователя (PATCH)
//  - заменить аватар (PATCH)
//  - “залайкать” карточку (PUT)
//  - удалить лайк карточки (DELETE)
