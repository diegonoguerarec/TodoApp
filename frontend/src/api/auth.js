import { apiFetch } from './client'

export async function registerUser({ username, password }) {
  const json = await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
  return json?.data
}

export async function loginUser({ username, password }) {
  const json = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
  return json?.data
}
