# Todo 서버 (백엔드)

Node.js + Express + SQLite로 만든 간단한 RESTful API 서버입니다.

## 📚 서버 구조 설명

### 1. `server.js` - 메인 서버 파일
**역할**: Express 서버를 실행하고 API 엔드포인트를 정의합니다.

**주요 기능**:
- `GET /api/todos` - 모든 할 일 목록 가져오기
- `POST /api/todos` - 새 할 일 추가
- `PATCH /api/todos/:id` - 할 일 수정 (완료/미완료, 텍스트)
- `DELETE /api/todos/:id` - 할 일 삭제

**쉬운 설명**:
웹사이트가 "할 일 주세요" 하면 데이터를 주고, "저장해주세요" 하면 저장하는 우체통 같은 역할입니다.

### 2. `database.js` - 데이터베이스 관리
**역할**: SQLite 데이터베이스와 통신하는 함수들을 모아놓은 파일입니다.

**주요 함수**:
- `getAllTodos()` - 모든 할 일 가져오기
- `createTodo(todo)` - 새 할 일 저장
- `updateTodo(id, updates)` - 할 일 수정
- `deleteTodo(id)` - 할 일 삭제

**쉬운 설명**:
엑셀 파일을 다루는 것처럼, 데이터베이스에 데이터를 읽고 쓰는 도구입니다.

### 3. `todos.json` - JSON 데이터베이스 파일
**역할**: 실제 할 일 데이터가 저장되는 파일입니다 (서버 실행 시 자동 생성).

**쉬운 설명**:
모든 할 일이 JSON 형식으로 저장되는 텍스트 파일이에요. 메모장으로 열어서 내용을 직접 볼 수도 있습니다! 서버를 껐다 켜도 데이터가 그대로 남아있습니다.

## 🚀 서버 실행 방법

### 1단계: 의존성 설치
```powershell
cd server
npm install
```
**설명**: 서버 실행에 필요한 프로그램(라이브러리)들을 다운로드합니다.

### 2단계: 서버 시작
```powershell
npm start
```
**설명**: 서버를 실행합니다. `http://localhost:3001`에서 서버가 돌아갑니다.

### 개발 모드 (파일 수정 시 자동 재시작)
```powershell
npm run dev
```

## 🔌 API 사용 예제

### 1. 모든 할 일 가져오기
```
GET http://localhost:3001/api/todos
```
**응답 예시**:
```json
[
  {
    "id": "abc-123",
    "text": "장보기",
    "completed": 0,
    "createdAt": 1704067200000
  }
]
```

### 2. 새 할 일 추가하기
```
POST http://localhost:3001/api/todos
Content-Type: application/json

{
  "text": "운동하기"
}
```

### 3. 할 일 완료 표시
```
PATCH http://localhost:3001/api/todos/abc-123
Content-Type: application/json

{
  "completed": true
}
```

### 4. 할 일 삭제
```
DELETE http://localhost:3001/api/todos/abc-123
```

## 📦 설치된 패키지 설명

- **express**: 웹 서버를 쉽게 만들어주는 도구
- **cors**: 프론트엔드(다른 포트)에서 서버에 접근할 수 있게 해줌

## ⚙️ 포트 변경하는 법

`server.js` 파일의 3번째 줄을 수정하세요:
```javascript
const PORT = 3001; // 원하는 포트 번호로 변경
```

## 🛑 서버 중지

터미널에서 `Ctrl + C`를 누르면 서버가 중지됩니다.
