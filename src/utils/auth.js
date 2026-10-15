import Cookies from 'js-cookie'
import dayjs from 'dayjs'

const TokenKey = 'Admin-Token'

export function getToken() {
  const token = Cookies.get(TokenKey)
  if (token) {
    Cookies.set(TokenKey, token, { expires: dayjs().add(window.config.expires || 30, 'minute').toDate() })
  }
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, { expires: dayjs().add(window.config.expires || 30, 'minute').toDate() })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setLocalStorage(key, value) {
  let tempValue = ''
  if (typeof (value) === 'object') {
    tempValue = JSON.stringify(value)
  }
  return localStorage.setItem(`glory.client.${key}`, tempValue)
}

export function getLocalStorage(key) {
  return localStorage.getItem(`glory.client.${key}`)
}

export function cleanLocalStorage() {
  localStorage.clear()
}
