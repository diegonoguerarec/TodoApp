export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

const TOKEN_STORAGE_KEY = 'todoapp_token'

export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY)
  } catch {
    return null
  }
}

export function setToken(token) {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token)
  } catch {
    // ignore
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
  } catch {
    // ignore
  }
}

export async function apiFetch(path, options = {}) {
  const token = options.token ?? getToken()

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  let json
  try {
    json = await res.json()
  } catch {
    json = undefined
  }

  if (!res.ok) {
    const message = json?.message || `Request failed (${res.status})`
    throw new ApiError(message, res.status, json)
  }

  return json
}
