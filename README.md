# 할 일 리스트 (Todo)

간단하고 아름다운 할 일 관리 웹앱입니다. **서버에 데이터가 저장**되므로 브라우저를 닫아도 데이터가 유지됩니다.

## 🏗️ 프로젝트 구조

```
todo/
├── todo/          # 프론트엔드 (React + Vite)
│   ├── src/
│   │   ├── App.tsx      # 메인 앱
│   │   ├── api.ts       # 서버 통신
│   │   └── main.tsx     # 엔트리
│   └── styles.css       # Todoist 스타일
├── server/        # 백엔드 (Node.js + Express)
│   ├── server.js        # API 서버
│   ├── database.js      # 데이터 관리
│   └── todos.json       # 데이터 저장
└── README.md
```

## 🚀 빠른 실행

### 방법 1: 바탕화면 아이콘 (권장)
1. 바탕화면의 `Todo App` 아이콘을 더블클릭
2. 자동으로 프론트엔드가 열립니다
3. **서버는 별도로 실행해야 합니다** (아래 참조)

### 방법 2: 수동 실행

#### 1단계: 서버 실행 (필수!)
```powershell
cd server
npm install  # 처음 한 번만
npm start
```

서버가 실행되면: `✅ 서버가 http://localhost:3001 에서 실행 중입니다`

#### 2단계: 프론트엔드 실행 (새 터미널 창)
```powershell
cd todo
npm install  # 처음 한 번만
npm run dev
```

브라우저에서 자동으로 열립니다:
- **프론트엔드**: `http://localhost:5174`
- **서버 API**: `http://localhost:3001/api/todos`

## 📚 기능 설명

### 프론트엔드 (todo/)
- Todoist 스타일의 깔끔한 UI
- 할 일 추가/수정/삭제
- 완료/미완료 필터링
- 드래그 앤 드롭으로 순서 변경
- 서버 API와 실시간 통신

### 백엔드 (server/)
- RESTful API 제공
- JSON 파일에 데이터 저장
- CORS 지원 (프론트엔드 접근 허용)

## 🔌 API 엔드포인트

서버가 제공하는 API:

- `GET /api/todos` - 모든 할 일 조회
- `POST /api/todos` - 새 할 일 추가
- `PATCH /api/todos/:id` - 할 일 수정
- `DELETE /api/todos/:id` - 할 일 삭제

## 💾 데이터 저장 위치

데이터는 `server/todos.json` 파일에 저장됩니다. 이 파일을 메모장으로 열어서 직접 확인할 수도 있어요!

## 🛠️ 개발 모드

파일 수정 시 자동 재시작:

```powershell
# 서버 개발 모드
cd server
npm run dev

# 프론트엔드는 기본적으로 HMR(Hot Module Reload) 지원
cd todo
npm run dev
```

## ❓ 문제 해결

### 서버가 안 켜져요
- `server/` 폴더에서 `npm install` 했는지 확인
- 포트 3001이 이미 사용 중인지 확인

### 프론트엔드에서 데이터가 안 불러와져요
- 서버가 실행 중인지 확인 (`http://localhost:3001/api/todos`로 접속해보세요)
- 브라우저 콘솔(F12)에서 에러 확인

### 서버를 끄려면?
터미널에서 `Ctrl + C` 를 누르세요

## 📖 더 알아보기

- [프론트엔드 상세 설명](todo/README.md)
- [서버 상세 설명](server/README.md)

## 🎨 기술 스택

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express
- **Database**: JSON File Storage
- **Styling**: Custom CSS (Todoist-inspired)

