import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { randomUUID } from 'crypto';
import {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  closeDatabase
} from './database.js';

const app = express();
const PORT = process.env.PORT || 3001;

// 미들웨어 설정
app.use(cors()); // 다른 포트(프론트엔드)에서 접근 허용
app.use(express.json()); // JSON 요청 본문 파싱

// ==================== API 라우트 ====================

// 1. 모든 할 일 조회 (GET /api/todos)
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await getAllTodos();
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// 2. 새 할 일 생성 (POST /api/todos)
app.post('/api/todos', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    // 현재 todos 개수를 구해서 마지막 순서로 추가
    const todos = await getAllTodos();
    const maxOrder = todos.length > 0 ? Math.max(...todos.map(t => t.order || 0)) : -1;
    
    const newTodo = {
      id: randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: Date.now(),
      order: maxOrder + 1
    };
    
    await createTodo(newTodo);
    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// 3. 할 일 수정 (PATCH /api/todos/:id)
app.patch('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const updatedTodo = await updateTodo(id, updates);
    
    if (!updatedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// 4. 할 일 삭제 (DELETE /api/todos/:id)
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteTodo(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

// 5. 할 일 순서 일괄 업데이트 (PUT /api/todos/reorder)
app.put('/api/todos/reorder', async (req, res) => {
  try {
    const { ids } = req.body; // [id1, id2, id3, ...]
    
    if (!Array.isArray(ids)) {
      return res.status(400).json({ error: 'ids must be an array' });
    }
    
    // 각 todo의 order를 배열 인덱스로 업데이트
    const updatePromises = ids.map((id, index) => 
      updateTodo(id, { order: index })
    );
    
    await Promise.all(updatePromises);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error reordering todos:', error);
    res.status(500).json({ error: 'Failed to reorder todos' });
  }
});

// 헬스 체크 엔드포인트 (배포 확인용)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`✅ 서버가 http://localhost:${PORT} 에서 실행 중입니다`);
  console.log(`📡 API 엔드포인트: http://localhost:${PORT}/api/todos`);
  console.log(`🗄️  데이터베이스: ${process.env.DATABASE_URL ? 'PostgreSQL' : 'JSON 파일'}`);
});

// 서버 종료 시 정리
process.on('SIGINT', async () => {
  console.log('\n서버를 종료합니다...');
  await closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n서버를 종료합니다...');
  await closeDatabase();
  process.exit(0);
});