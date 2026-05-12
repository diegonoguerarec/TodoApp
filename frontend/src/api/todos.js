import { apiFetch } from './client'

export async function listTodos() {
  const json = await apiFetch('/todos', { method: 'GET' })
  return json?.data ?? []
}

export async function createTodo({ name, description }) {
  const json = await apiFetch('/todos', {
    method: 'POST',
    body: JSON.stringify({ name, description }),
  })
  return json?.data
}

export async function updateTodo(id, payload) {
  const json = await apiFetch(`/todos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
  return json?.data
}

export async function deleteTodo(id) {
  const json = await apiFetch(`/todos/${id}`, { method: 'DELETE' })
  return json?.data
}
