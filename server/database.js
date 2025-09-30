import pg from 'pg';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 환경 변수에서 데이터베이스 URL 가져오기 (배포 시 사용)
// 로컬에서는 JSON 파일 사용
const usePostgres = !!process.env.DATABASE_URL;

let pool;
if (usePostgres) {
  const { Pool } = pg;
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  // 테이블 생성 (없으면)
  pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id TEXT PRIMARY KEY,
      text TEXT NOT NULL,
      completed BOOLEAN DEFAULT false,
      created_at BIGINT NOT NULL,
      display_order INTEGER DEFAULT 0
    )
  `).catch(err => console.error('Error creating table:', err));
}

// JSON 파일 경로 (로컬용)
const DB_FILE = join(__dirname, 'todos.json');

// 로컬 JSON 파일 초기화
if (!usePostgres && !existsSync(DB_FILE)) {
  writeFileSync(DB_FILE, JSON.stringify([]), 'utf8');
}

// ==================== PostgreSQL 함수 ====================

async function getAllTodosPostgres() {
  const result = await pool.query('SELECT * FROM todos ORDER BY display_order ASC, created_at DESC');
  return result.rows.map(row => ({
    id: row.id,
    text: row.text,
    completed: row.completed,
    createdAt: Number(row.created_at),
    order: row.display_order || 0
  }));
}

async function createTodoPostgres(todo) {
  await pool.query(
    'INSERT INTO todos (id, text, completed, created_at, display_order) VALUES ($1, $2, $3, $4, $5)',
    [todo.id, todo.text, todo.completed, todo.createdAt, todo.order || 0]
  );
  return todo;
}

async function updateTodoPostgres(id, updates) {
  const fields = [];
  const values = [];
  let paramIndex = 1;

  if (updates.text !== undefined) {
    fields.push(`text = $${paramIndex++}`);
    values.push(updates.text);
  }
  if (updates.completed !== undefined) {
    fields.push(`completed = $${paramIndex++}`);
    values.push(updates.completed);
  }
  if (updates.order !== undefined) {
    fields.push(`display_order = $${paramIndex++}`);
    values.push(updates.order);
  }

  if (fields.length === 0) return null;

  values.push(id);
  const query = `UPDATE todos SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
  
  const result = await pool.query(query, values);
  if (result.rows.length === 0) return null;
  
  const row = result.rows[0];
  return {
    id: row.id,
    text: row.text,
    completed: row.completed,
    createdAt: Number(row.created_at),
    order: row.display_order || 0
  };
}

async function deleteTodoPostgres(id) {
  const result = await pool.query('DELETE FROM todos WHERE id = $1', [id]);
  return result.rowCount > 0;
}

// ==================== JSON 파일 함수 ====================

function getAllTodosJSON() {
  try {
    const data = readFileSync(DB_FILE, 'utf8');
    const todos = JSON.parse(data);
    // order 기준으로 정렬 (order가 없으면 0으로 간주)
    return todos.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error('Error reading todos:', error);
    return [];
  }
}

function saveTodos(todos) {
  try {
    writeFileSync(DB_FILE, JSON.stringify(todos, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving todos:', error);
    return false;
  }
}

function createTodoJSON(todo) {
  const todos = getAllTodosJSON();
  const todoWithOrder = { ...todo, order: todo.order || 0 };
  todos.push(todoWithOrder);
  saveTodos(todos);
  return todoWithOrder;
}

function updateTodoJSON(id, updates) {
  const todos = getAllTodosJSON();
  const index = todos.findIndex(t => t.id === id);
  
  if (index === -1) return null;
  
  todos[index] = { ...todos[index], ...updates };
  saveTodos(todos);
  return todos[index];
}

function deleteTodoJSON(id) {
  const todos = getAllTodosJSON();
  const filteredTodos = todos.filter(t => t.id !== id);
  
  if (filteredTodos.length === todos.length) {
    return false;
  }
  
  saveTodos(filteredTodos);
  return true;
}

// ==================== 공개 API (자동 선택) ====================

export function getAllTodos() {
  return usePostgres ? getAllTodosPostgres() : Promise.resolve(getAllTodosJSON());
}

export function createTodo(todo) {
  return usePostgres ? createTodoPostgres(todo) : Promise.resolve(createTodoJSON(todo));
}

export function updateTodo(id, updates) {
  return usePostgres ? updateTodoPostgres(id, updates) : Promise.resolve(updateTodoJSON(id, updates));
}

export function deleteTodo(id) {
  return usePostgres ? deleteTodoPostgres(id) : Promise.resolve(deleteTodoJSON(id));
}

export function closeDatabase() {
  if (pool) {
    return pool.end();
  }
  return Promise.resolve();
}