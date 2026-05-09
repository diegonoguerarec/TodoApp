import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'
import { loginUser, registerUser } from './api/auth'
import { ApiError, clearToken, getToken, setToken } from './api/client'
import { createTodo, deleteTodo, listTodos, updateTodo } from './api/todos'

function App() {
  const [token, setTokenState] = useState(() => getToken())

  const [authMode, setAuthMode] = useState('login')
  const [authUsername, setAuthUsername] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(() => Boolean(getToken()))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [editingId, setEditingId] = useState(null)

  const isEditing = editingId !== null
  const isAuthed = Boolean(token)

  const logout = useCallback((message) => {
    clearToken()
    setTokenState(null)
    setTodos([])
    setEditingId(null)
    setName('')
    setDescription('')
    setLoading(false)
    setError(message || '')
  }, [])

  const sortedTodos = useMemo(() => {
    return [...todos].sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
  }, [todos])

  const refresh = useCallback(async () => {
    setError('')
    setLoading(true)
    try {
      const data = await listTodos()
      setTodos(Array.isArray(data) ? data : [])
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        logout('Your session expired. Please log in again.')
        return
      }

      setError(e instanceof Error ? e.message : 'Failed to load todos')
    } finally {
      setLoading(false)
    }
  }, [logout])

  useEffect(() => {
    if (!isAuthed) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh()
  }, [isAuthed, refresh])

  async function onAuthSubmit(e) {
    e.preventDefault()
    setError('')

    const username = authUsername.trim()
    const password = authPassword

    if (!username || !password || password.trim() === '') {
      setError('Username and password are required')
      return
    }

    setAuthLoading(true)
    try {
      if (authMode === 'register') {
        await registerUser({ username, password })
      }

      const jwt = await loginUser({ username, password })
      if (typeof jwt !== 'string' || jwt.trim() === '') {
        throw new Error('Login did not return a token')
      }

      setToken(jwt)
      setTokenState(jwt)
      setAuthPassword('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Authentication failed')
    } finally {
      setAuthLoading(false)
    }
  }

  function resetForm() {
    setName('')
    setDescription('')
    setEditingId(null)
  }

  function startEdit(todo) {
    setError('')
    setEditingId(todo.id)
    setName(todo.name ?? '')
    setDescription(todo.description ?? '')
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')

    const trimmedName = name.trim()
    const trimmedDescription = description.trim()
    if (!trimmedName || !trimmedDescription) {
      setError('Name and description are required')
      return
    }

    setSaving(true)
    try {
      if (isEditing) {
        await updateTodo(editingId, {
          name: trimmedName,
          description: trimmedDescription,
        })
        await refresh()
      } else {
        const created = await createTodo({
          name: trimmedName,
          description: trimmedDescription,
        })
        setTodos((prev) => [...prev, created])
      }
      resetForm()
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        logout('Please log in to continue.')
        return
      }
      setError(e instanceof Error ? e.message : 'Request failed')
    } finally {
      setSaving(false)
    }
  }

  async function onToggle(todo) {
    setError('')

    const nextCompleted = !todo.completed
    setTodos((prev) =>
      prev.map((t) => (t.id === todo.id ? { ...t, completed: nextCompleted } : t)),
    )

    try {
      await updateTodo(todo.id, { completed: nextCompleted })
      await refresh()
    } catch (e) {
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? todo : t)))

      if (e instanceof ApiError && e.status === 401) {
        logout('Please log in to continue.')
        return
      }
      setError(e instanceof Error ? e.message : 'Failed to update todo')
    }
  }

  async function onRemove(todo) {
    setError('')
    setTodos((prev) => prev.filter((t) => t.id !== todo.id))
    if (editingId === todo.id) resetForm()

    try {
      await deleteTodo(todo.id)
      await refresh()
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        logout('Please log in to continue.')
        return
      }

      await refresh()
      setError(e instanceof Error ? e.message : 'Failed to delete todo')
    }
  }

  if (!isAuthed) {
    return (
      <div className="todoApp">
        <header className="todoHeader">
          <h1>{authMode === 'register' ? 'Register' : 'Login'}</h1>
        </header>

        <form className="todoForm" onSubmit={onAuthSubmit}>
          <div className="todoField">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              value={authUsername}
              onChange={(e) => setAuthUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="todoField">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              autoComplete={authMode === 'register' ? 'new-password' : 'current-password'}
            />
          </div>

          <div className="todoActions">
            <button className="primary" type="submit" disabled={authLoading}>
              {authLoading
                ? authMode === 'register'
                  ? 'Creating…'
                  : 'Signing in…'
                : authMode === 'register'
                  ? 'Create account'
                  : 'Sign in'}
            </button>
            <button
              type="button"
              onClick={() => {
                setError('')
                setAuthMode((m) => (m === 'login' ? 'register' : 'login'))
              }}
              disabled={authLoading}
            >
              {authMode === 'register' ? 'I already have an account' : 'Create an account'}
            </button>
          </div>
        </form>

        {error ? <div className="todoError">{error}</div> : null}
      </div>
    )
  }

  return (
    <div className="todoApp">
      <header className="todoHeader todoHeaderRow">
        <h1>Todos</h1>
        <div className="todoHeaderActions">
          <button type="button" onClick={() => logout('')} disabled={saving || loading}>
            Logout
          </button>
        </div>
      </header>

      <form className="todoForm" onSubmit={onSubmit}>
        <div className="todoField">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Buy groceries"
            autoComplete="off"
          />
        </div>

        <div className="todoField">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Milk, eggs, bread"
            rows={3}
          />
        </div>

        <div className="todoActions">
          <button className="primary" type="submit" disabled={saving}>
            {isEditing ? (saving ? 'Saving…' : 'Save') : saving ? 'Creating…' : 'Create'}
          </button>
          {isEditing ? (
            <button type="button" onClick={resetForm} disabled={saving}>
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      {error ? <div className="todoError">{error}</div> : null}

      <section className="todoListSection" aria-busy={loading ? 'true' : 'false'}>
        <h2>List</h2>

        {loading ? (
          <p>Loading…</p>
        ) : sortedTodos.length === 0 ? (
          <p>No todos yet.</p>
        ) : (
          <ul className="todoList">
            {sortedTodos.map((todo) => (
              <li key={todo.id} className="todoItem">
                <label className="todoToggle">
                  <input
                    type="checkbox"
                    checked={Boolean(todo.completed)}
                    onChange={() => onToggle(todo)}
                  />
                  <span className={todo.completed ? 'todoText done' : 'todoText'}>
                    <span className="todoName">{todo.name}</span>
                    <span className="todoDescription">{todo.description}</span>
                  </span>
                </label>

                <div className="todoRowActions">
                  <button type="button" onClick={() => startEdit(todo)} disabled={saving}>
                    Edit
                  </button>
                  <button type="button" onClick={() => onRemove(todo)} disabled={saving}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default App
