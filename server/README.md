# Todo 서버 (백엔드)

Node.js + Express로 만든 RESTful API 서버입니다.  
**PostgreSQL**(배포) 또는 **JSON 파일**(로컬)에 데이터를 저장합니다.

---

## 📚 서버 구조 설명

### 1. `server.js` - 메인 서버 파일
**역할**: Express 서버를 실행하고 API 엔드포인트를 정의합니다.

**주요 기능**:
- `GET /api/todos` - 모든 할 일 목록 가져오기
- `POST /api/todos` - 새 할 일 추가
- `PATCH /api/todos/:id` - 할 일 수정 (완료/미완료, 텍스트)
- `DELETE /api/todos/:id` - 할 일 삭제
- `GET /health` - 서버 상태 확인 (헬스체크)

**쉬운 설명**:  
웹사이트가 "할 일 주세요" 하면 데이터를 주고, "저장해주세요" 하면 저장하는 우체통 같은 역할입니다.

---

### 2. `database.js` - 데이터베이스 관리
**역할**: PostgreSQL과 JSON 파일 두 가지 저장 방식을 자동으로 선택하는 어댑터입니다.

**자동 환경 감지** (Adapter Pattern):
```javascript
DATABASE_URL 환경변수 있음 → PostgreSQL 사용 (배포)
DATABASE_URL 환경변수 없음 → JSON 파일 사용 (로컬)
```

**주요 함수**:
- `getAllTodos()` - 모든 할 일 가져오기
- `createTodo(todo)` - 새 할 일 저장
- `updateTodo(id, updates)` - 할 일 수정
- `deleteTodo(id)` - 할 일 삭제
- `closeDatabase()` - DB 연결 종료 (정리)

**쉬운 설명**:  
엑셀 파일을 다루는 것처럼, 데이터베이스에 데이터를 읽고 쓰는 도구입니다.  
개발할 때는 간단한 JSON 파일을, 배포할 때는 진짜 데이터베이스를 자동으로 사용합니다.

---

### 3. `todos.json` - JSON 데이터베이스 파일 (로컬용)
**역할**: 로컬 개발 시 실제 할 일 데이터가 저장되는 파일입니다 (서버 실행 시 자동 생성).

**쉬운 설명**:  
모든 할 일이 JSON 형식으로 저장되는 텍스트 파일이에요. 메모장으로 열어서 내용을 직접 볼 수도 있습니다! 서버를 껐다 켜도 데이터가 그대로 남아있습니다.

**참고**: 배포 환경에서는 이 파일이 사용되지 않고, PostgreSQL 데이터베이스가 사용됩니다.

---

## 🚀 서버 실행 방법

### 1단계: 의존성 설치
```bash
cd server
npm install
```
**설명**: 서버 실행에 필요한 프로그램(라이브러리)들을 다운로드합니다.

### 2단계: 서버 시작
```bash
npm start
```
**설명**: 서버를 실행합니다. `http://localhost:3001`에서 서버가 돌아갑니다.

### 개발 모드 (파일 수정 시 자동 재시작)
```bash
npm run dev
```

---

## 🌐 환경변수 설정

### 로컬 개발
환경변수 없이 실행하면 JSON 파일 사용 (자동):
```bash
npm start
```

### 배포 환경 (PostgreSQL 사용)
`.env` 파일 생성 또는 플랫폼 환경변수 설정:
```env
DATABASE_URL=postgresql://user:password@host:5432/database
NODE_ENV=production
PORT=3001
```

---

## 🔌 API 사용 예제

### 1. 모든 할 일 가져오기
```http
GET http://localhost:3001/api/todos
```
**응답 예시**:
```json
[
  {
    "id": "abc-123",
    "text": "장보기",
    "completed": false,
    "createdAt": 1704067200000
  }
]
```

### 2. 새 할 일 추가하기
```http
POST http://localhost:3001/api/todos
Content-Type: application/json

{
  "text": "운동하기"
}
```

### 3. 할 일 완료 표시
```http
PATCH http://localhost:3001/api/todos/abc-123
Content-Type: application/json

{
  "completed": true
}
```

### 4. 할 일 삭제
```http
DELETE http://localhost:3001/api/todos/abc-123
```

### 5. 서버 상태 확인
```http
GET http://localhost:3001/health
```

---

## 📦 설치된 패키지 설명

- **express**: 웹 서버를 쉽게 만들어주는 도구
- **cors**: 프론트엔드(다른 포트)에서 서버에 접근할 수 있게 해줌
- **dotenv**: 환경변수(.env 파일) 관리
- **pg**: PostgreSQL 데이터베이스 클라이언트

---

## ⚙️ 포트 변경하는 법

환경변수로 포트 설정:
```bash
PORT=4000 npm start
```

또는 `.env` 파일:
```env
PORT=4000
```

---

## 🛑 서버 중지

터미널에서 `Ctrl + C`를 누르면 서버가 정리되고 중지됩니다.

---

## 🚀 배포

Render, Railway, Heroku 등 Node.js를 지원하는 플랫폼에 배포 가능합니다.

**필요한 환경변수**:
- `DATABASE_URL`: PostgreSQL 연결 문자열
- `NODE_ENV`: `production`
- `PORT`: 플랫폼이 자동 설정 (선택)

자세한 배포 가이드는 [README_DEPLOY.md](../README_DEPLOY.md)를 참고하세요!
