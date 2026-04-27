import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { createTodo, deleteTodo, listTodos, updateTodo } from './api/todos'

function App() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [editingId, setEditingId] = useState(null)

  const isEditing = editingId !== null

  const sortedTodos = useMemo(() => {
    return [...todos].sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
  }, [todos])

  async function refresh() {
    setError('')
    setLoading(true)
    try {
      const data = await listTodos()
      setTodos(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load todos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        const updated = await updateTodo(editingId, {
          name: trimmedName,
          description: trimmedDescription,
        })
        setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
      } else {
        const created = await createTodo({
          name: trimmedName,
          description: trimmedDescription,
        })
        setTodos((prev) => [...prev, created])
      }
      resetForm()
    } catch (e) {
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
      const updated = await updateTodo(todo.id, { completed: nextCompleted })
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)))
    } catch (e) {
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? todo : t)))
      setError(e instanceof Error ? e.message : 'Failed to update todo')
    }
  }

  async function onRemove(todo) {
    setError('')
    setTodos((prev) => prev.filter((t) => t.id !== todo.id))
    if (editingId === todo.id) resetForm()

    try {
      await deleteTodo(todo.id)
    } catch (e) {
      await refresh()
      setError(e instanceof Error ? e.message : 'Failed to delete todo')
    }
  }

  return (
    <div className="todoApp">
      <header className="todoHeader">
        <h1>Todos</h1>
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
