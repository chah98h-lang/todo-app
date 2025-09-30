import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as api from './api'

type Todo = {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

type Filter = 'all' | 'active' | 'completed'

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [loading, setLoading] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  // 초기 데이터 로드
  useEffect(() => {
    api.fetchTodos()
      .then(setTodos)
      .catch(err => console.error('Failed to load todos:', err))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    if (filter === 'active') return todos.filter((t) => !t.completed)
    if (filter === 'completed') return todos.filter((t) => t.completed)
    return todos
  }, [todos, filter])

  const leftCount = useMemo(() => todos.filter((t) => !t.completed).length, [todos])

  const addTodo = useCallback(async (text: string) => {
    try {
      const newTodo = await api.createTodo(text)
      setTodos((old) => [newTodo, ...old])
    } catch (err) {
      console.error('Failed to add todo:', err)
      alert('할 일 추가에 실패했습니다')
    }
  }, [])

  const updateTodo = useCallback(async (id: string, updater: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
    try {
      const updated = await api.updateTodo(id, updater)
      setTodos((old) => old.map((t) => (t.id === id ? updated : t)))
    } catch (err) {
      console.error('Failed to update todo:', err)
      alert('할 일 수정에 실패했습니다')
    }
  }, [])

  const deleteTodo = useCallback(async (id: string) => {
    try {
      await api.deleteTodo(id)
      setTodos((old) => old.filter((t) => t.id !== id))
    } catch (err) {
      console.error('Failed to delete todo:', err)
      alert('할 일 삭제에 실패했습니다')
    }
  }, [])

  const clearCompleted = useCallback(async () => {
    const completedIds = todos.filter(t => t.completed).map(t => t.id)
    try {
      await Promise.all(completedIds.map(id => api.deleteTodo(id)))
      setTodos((old) => old.filter((t) => !t.completed))
    } catch (err) {
      console.error('Failed to clear completed:', err)
      alert('완료 항목 삭제에 실패했습니다')
    }
  }, [todos])

  const reorder = useCallback(async (idsInOrder: string[]) => {
    // 먼저 UI 업데이트 (낙관적 업데이트)
    setTodos((old) => {
      const byId = new Map(old.map((t) => [t.id, t]))
      return idsInOrder.map((id) => byId.get(id)!).filter(Boolean)
    })
    
    // 서버에 순서 저장
    try {
      await api.reorderTodos(idsInOrder)
    } catch (err) {
      console.error('Failed to save order:', err)
      // 에러 시 원래 순서로 복구 (선택사항)
    }
  }, [])

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    const value = (inputRef.current?.value || '').trim()
    if (!value) return
    addTodo(value)
    if (inputRef.current) inputRef.current.value = ''
  }

  if (loading) {
    return (
      <div className="app-root">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>할 일 리스트</h1>
      </header>

      <main className="app-main">
        <form className="new-todo" onSubmit={onSubmit} autoComplete="off" noValidate>
          <input ref={inputRef} className="input" type="text" placeholder="할 일을 입력하고 Enter 또는 추가 버튼을 누르세요" aria-label="새 할 일" maxLength={200} />
          <button type="submit" className="btn primary" aria-label="추가">추가</button>
        </form>

        <section className="toolbar" aria-label="필터와 작업">
          <div className="filters" role="tablist" aria-label="필터">
            <FilterButton current={filter} value="all" onSelect={setFilter}>모두</FilterButton>
            <FilterButton current={filter} value="active" onSelect={setFilter}>진행중</FilterButton>
            <FilterButton current={filter} value="completed" onSelect={setFilter}>완료</FilterButton>
          </div>
          <div className="actions">
            <button className="btn small" onClick={clearCompleted} title="완료된 항목 모두 삭제">완료 항목 삭제</button>
          </div>
          <div className="counter" aria-live="polite">
            <span>{leftCount}</span>개 남음
          </div>
        </section>

        <TodoList
          todos={filtered}
          onToggle={(id, completed) => updateTodo(id, { completed })}
          onEdit={(id, text) => updateTodo(id, { text })}
          onDelete={deleteTodo}
          onReorder={reorder}
        />

        <p className="hint">드래그 앤 드롭으로 순서를 변경할 수 있어요 (서버에 자동 저장). 더블클릭 또는 연필 아이콘으로 편집할 수 있어요.</p>
      </main>

      <footer className="app-footer">
        <small>데이터는 서버에 저장됩니다 (http://localhost:3001)</small>
      </footer>
    </div>
  )
}

function FilterButton({ current, value, onSelect, children }: { current: Filter, value: Filter, onSelect: (f: Filter) => void, children: React.ReactNode }) {
  const active = current === value
  return (
    <button className={`filter btn small ${active ? 'is-active' : ''}`} role="tab" aria-selected={active} onClick={() => onSelect(value)}>
      {children}
    </button>
  )
}

function TodoList({ todos, onToggle, onEdit, onDelete, onReorder }: {
  todos: Todo[]
  onToggle: (id: string, completed: boolean) => void
  onEdit: (id: string, text: string) => void
  onDelete: (id: string) => void
  onReorder: (idsInOrder: string[]) => void
}) {
  const listRef = useRef<HTMLUListElement>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)

  const handleDragOver: React.DragEventHandler<HTMLUListElement> = (e) => {
    e.preventDefault()
    const container = listRef.current!
    const after = getDragAfterElement(container, e.clientY)
    const dragging = container.querySelector('.dragging') as HTMLElement | null
    if (!dragging) return
    if (after == null) container.appendChild(dragging)
    else container.insertBefore(dragging, after)
  }

  const handleDrop = () => {
    const container = listRef.current!
    const ids = Array.from(container.children).map((li) => (li as HTMLElement).dataset.id!)
    onReorder(ids)
    setDraggingId(null)
  }

  return (
    <ul ref={listRef} className="todo-list" aria-label="할 일 목록" onDragOver={handleDragOver} onDrop={handleDrop}>
      {todos.map((t) => (
        <TodoItem key={t.id} todo={t} dragging={draggingId === t.id} setDragging={setDraggingId} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  )
}

function TodoItem({ todo, dragging, setDragging, onToggle, onEdit, onDelete }: {
  todo: Todo
  dragging: boolean
  setDragging: (id: string | null) => void
  onToggle: (id: string, completed: boolean) => void
  onEdit: (id: string, text: string) => void
  onDelete: (id: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
      const v = inputRef.current!.value
      inputRef.current!.setSelectionRange(v.length, v.length)
    }
  }, [editing])

  const startEdit = () => setEditing(true)
  const cancelEdit = () => setEditing(false)
  const commitEdit = () => {
    const value = (inputRef.current?.value || '').trim()
    onEdit(todo.id, value || todo.text)
    setEditing(false)
  }

  return (
    <li className={`todo-item ${dragging ? 'dragging' : ''}`} data-id={todo.id} draggable onDragStart={() => setDragging(todo.id)} onDragEnd={() => setDragging(null)}>
      <input className="checkbox" type="checkbox" checked={todo.completed} onChange={(e) => onToggle(todo.id, e.target.checked)} aria-label="완료표시" />

      {editing ? (
        <input ref={inputRef} className="edit-input" type="text" defaultValue={todo.text} maxLength={200} onKeyDown={(e) => {
          if (e.key === 'Enter') commitEdit()
          if (e.key === 'Escape') cancelEdit()
        }} onBlur={commitEdit} />
      ) : (
        <span className={`todo-text ${todo.completed ? 'completed' : ''}`} onDoubleClick={startEdit} title="더블클릭하여 편집">
          {todo.text}
        </span>
      )}

      <div className="todo-actions">
        <button className="btn icon-btn ghost" title="편집" onClick={startEdit} aria-label="편집">{pencilIcon()}</button>
        <button className="btn icon-btn ghost" title="삭제" onClick={() => onDelete(todo.id)} aria-label="삭제">{trashIcon()}</button>
      </div>
    </li>
  )
}

function getDragAfterElement(container: HTMLElement, y: number) {
  const elements = [...container.querySelectorAll('.todo-item:not(.dragging)')]
  return elements.reduce((closest, child) => {
    const box = child.getBoundingClientRect()
    const offset = y - box.top - box.height / 2
    if (offset < 0 && offset > closest.offset) return { offset, element: child }
    else return closest
  }, { offset: Number.NEGATIVE_INFINITY, element: null as Element | null }).element
}

function pencilIcon() {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.004 1.004 0 0 0 0-1.42l-2.34-2.34a1.004 1.004 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/></svg>
  )
}

function trashIcon() {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1z"/></svg>
  )
}