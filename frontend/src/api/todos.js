const API_URL = 'http://localhost:3000'

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  let json;
  try {
    json = await res.json();
  } catch {
    json = undefined;
  }

  if (!res.ok) {
    const message = json?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return json;
}

export async function listTodos() {
  const json = await apiFetch('/todos', { method: 'GET' });
  return json?.data ?? [];
}

export async function createTodo({ name, description }) {
  const json = await apiFetch('/todos', {
    method: 'POST',
    body: JSON.stringify({ name, description }),
  });
  return json?.data;
}

export async function updateTodo(id, payload) {
  const json = await apiFetch(`/todos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return json?.data;
}

export async function deleteTodo(id) {
  const json = await apiFetch(`/todos/${id}`, { method: 'DELETE' });
  return json?.data;
}
