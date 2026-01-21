import axios from 'axios'
const baseUrl = '/api/blogs'

let _token = null

export const setToken = newToken => {
  _token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

export default { getAll, setToken }