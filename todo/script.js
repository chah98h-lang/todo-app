(function () {
  'use strict';

  /** @typedef {{ id: string, text: string, completed: boolean, createdAt: number }} Todo */

  const STORAGE_KEY = 'todo.items.v1';
  const SELECTORS = {
    form: '#new-todo-form',
    input: '#new-todo-input',
    list: '#todo-list',
    filterButtons: '.filter',
    itemsLeft: '#items-left',
    clearCompleted: '#clear-completed',
  };

  /** @type {Todo[]} */
  let todos = [];
  /** @type {'all'|'active'|'completed'} */
  let currentFilter = 'all';

  // Init
  document.addEventListener('DOMContentLoaded', () => {
    const formEl = document.querySelector(SELECTORS.form);
    const inputEl = document.querySelector(SELECTORS.input);
    const clearBtn = document.querySelector(SELECTORS.clearCompleted);

    todos = loadTodos();
    bindFilterButtons();
    bindDragAndDrop();
    render();

    formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = (inputEl.value || '').trim();
      if (!text) return;
      addTodo(text);
      inputEl.value = '';
      inputEl.focus();
    });

    clearBtn.addEventListener('click', () => {
      const hadCompleted = todos.some((t) => t.completed);
      if (!hadCompleted) return;
      todos = todos.filter((t) => !t.completed);
      persist();
      render();
    });
  });

  function loadTodos() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.map((t) => ({
        id: String(t.id || cryptoRandomId()),
        text: String(t.text || ''),
        completed: Boolean(t.completed),
        createdAt: Number(t.createdAt || Date.now()),
      }));
    } catch (_) {
      return [];
    }
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }

  function addTodo(text) {
    const todo = /** @type {Todo} */({
      id: cryptoRandomId(),
      text,
      completed: false,
      createdAt: Date.now(),
    });
    todos.unshift(todo);
    persist();
    render();
  }

  function updateTodo(id, updater) {
    const idx = todos.findIndex((t) => t.id === id);
    if (idx === -1) return;
    const updated = { ...todos[idx], ...updater };
    todos.splice(idx, 1, updated);
    persist();
    render();
  }

  function deleteTodo(id) {
    todos = todos.filter((t) => t.id !== id);
    persist();
    render();
  }

  function getFilteredTodos() {
    if (currentFilter === 'active') return todos.filter((t) => !t.completed);
    if (currentFilter === 'completed') return todos.filter((t) => t.completed);
    return todos;
  }

  function render() {
    const listEl = document.querySelector(SELECTORS.list);
    listEl.innerHTML = '';
    const items = getFilteredTodos();
    for (const todo of items) {
      listEl.appendChild(createTodoElement(todo));
    }
    updateCounter();
  }

  function updateCounter() {
    const left = todos.filter((t) => !t.completed).length;
    const el = document.querySelector(SELECTORS.itemsLeft);
    el.textContent = String(left);
  }

  function createTodoElement(todo) {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.dataset.id = todo.id;
    li.draggable = true;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'checkbox';
    checkbox.checked = !!todo.completed;
    checkbox.ariaLabel = '완료표시';
    checkbox.addEventListener('change', () => updateTodo(todo.id, { completed: checkbox.checked }));

    const textSpan = document.createElement('span');
    textSpan.className = 'todo-text' + (todo.completed ? ' completed' : '');
    textSpan.textContent = todo.text;
    textSpan.title = '더블클릭하여 편집';
    textSpan.addEventListener('dblclick', () => beginEdit(li, todo));

    const actions = document.createElement('div');
    actions.className = 'todo-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'btn icon-btn ghost';
    editBtn.title = '편집';
    editBtn.innerHTML = pencilIcon();
    editBtn.addEventListener('click', () => beginEdit(li, todo));

    const delBtn = document.createElement('button');
    delBtn.className = 'btn icon-btn ghost';
    delBtn.title = '삭제';
    delBtn.innerHTML = trashIcon();
    delBtn.addEventListener('click', () => deleteTodo(todo.id));

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(actions);

    attachDragHandlers(li);

    return li;
  }

  function beginEdit(li, todo) {
    const existing = li.querySelector('.edit-input');
    if (existing) return;
    const textEl = li.querySelector('.todo-text');
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'edit-input';
    input.value = todo.text;
    input.maxLength = 200;
    textEl.replaceWith(input);
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);

    const finish = (commit) => {
      const value = input.value.trim();
      const newText = commit ? (value || todo.text) : todo.text;
      updateTodo(todo.id, { text: newText });
    };

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') finish(true);
      if (e.key === 'Escape') finish(false);
    });
    input.addEventListener('blur', () => finish(true));
  }

  function bindFilterButtons() {
    const buttons = document.querySelectorAll(SELECTORS.filterButtons);
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        currentFilter = btn.dataset.filter;
        render();
      });
    });
  }

  // Drag & Drop ordering
  function bindDragAndDrop() {
    const listEl = document.querySelector(SELECTORS.list);
    listEl.addEventListener('dragover', (e) => {
      e.preventDefault();
      const after = getDragAfterElement(listEl, e.clientY);
      const dragging = document.querySelector('.dragging');
      if (!dragging) return;
      if (after == null) listEl.appendChild(dragging);
      else listEl.insertBefore(dragging, after);
    });
    listEl.addEventListener('drop', persistFromDomOrder);
  }

  function attachDragHandlers(li) {
    li.addEventListener('dragstart', () => {
      li.classList.add('dragging');
    });
    li.addEventListener('dragend', () => {
      li.classList.remove('dragging');
    });
  }

  function getDragAfterElement(container, y) {
    const elements = [...container.querySelectorAll('.todo-item:not(.dragging)')];
    return elements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) return { offset, element: child };
      else return closest;
    }, { offset: Number.NEGATIVE_INFINITY, element: null }).element;
  }

  function persistFromDomOrder() {
    const listEl = document.querySelector(SELECTORS.list);
    const ids = [...listEl.children].map((li) => li.dataset.id);
    const byId = new Map(todos.map((t) => [t.id, t]));
    todos = ids.map((id) => byId.get(id)).filter(Boolean);
    persist();
    render();
  }

  function cryptoRandomId() {
    if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
    const arr = new Uint8Array(16);
    (window.crypto || window.msCrypto).getRandomValues(arr);
    return [...arr].map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  function pencilIcon() {
    return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.004 1.004 0 0 0 0-1.42l-2.34-2.34a1.004 1.004 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/></svg>';
  }

  function trashIcon() {
    return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1z"/></svg>';
  }
})();


