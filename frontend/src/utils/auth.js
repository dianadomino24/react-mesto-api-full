import { BASE_URL } from './utils'

const getResponseData = (res) => {
  return res.json().then((json) => {
    return res.ok ? json : Promise.reject(json)
  })
}

export const register = (email, password) =>
  fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  }).then((res) => getResponseData(res))

export const authorize = (email, password) =>
  fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  }).then((res) => getResponseData(res))

export const getContent = (token) =>
  fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => getResponseData(res))
