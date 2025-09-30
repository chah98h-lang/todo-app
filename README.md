# 할 일 리스트 (Todo App)

간단하고 아름다운 할 일 관리 웹앱입니다. **서버에 데이터가 저장**되므로 브라우저를 닫아도 데이터가 유지됩니다.

## 🌐 배포된 앱 사용하기

배포된 앱은 별도 설치 없이 브라우저에서 바로 사용할 수 있습니다!

**🔗 앱 URL**: `https://your-todo-app.vercel.app` (배포 후 링크 업데이트)

---

## 🏗️ 프로젝트 구조

```
todo-app/
├── todo/          # 프론트엔드 (React + Vite)
│   ├── src/
│   │   ├── App.tsx      # 메인 앱
│   │   ├── api.ts       # 서버 통신
│   │   └── main.tsx     # 엔트리
│   └── styles.css       # Todoist 스타일
├── server/        # 백엔드 (Node.js + Express)
│   ├── server.js        # API 서버
│   ├── database.js      # 데이터 관리
│   └── todos.json       # 데이터 저장 (로컬)
└── README_DEPLOY.md     # 배포 가이드
```

---

## 🚀 로컬 개발 환경 실행

### 1단계: 서버 실행 (필수!)
```bash
cd server
npm install  # 처음 한 번만
npm start
```

서버가 실행되면: `✅ 서버가 http://localhost:3001 에서 실행 중입니다`

### 2단계: 프론트엔드 실행 (새 터미널 창)
```bash
cd todo
npm install  # 처음 한 번만
npm run dev
```

브라우저에서 자동으로 열립니다:
- **프론트엔드**: `http://localhost:5173`
- **서버 API**: `http://localhost:3001/api/todos`

---

## 📚 주요 기능

### ✨ 프론트엔드
- 🎨 Todoist 스타일의 깔끔한 UI
- ✅ 할 일 추가/수정/삭제
- 🔍 완료/미완료 필터링
- 🖱️ 드래그 앤 드롭으로 순서 변경
- 🌓 다크모드 자동 전환 (시스템 설정)
- 📱 반응형 디자인 (모바일 대응)

### ⚙️ 백엔드
- 🔌 RESTful API 제공
- 💾 PostgreSQL (배포) / JSON 파일 (로컬) 저장
- 🌐 CORS 지원 (프론트엔드 접근 허용)
- 🔄 자동 환경 감지 (DATABASE_URL 유무)

---

## 🔌 API 엔드포인트

서버가 제공하는 API:

| 메서드 | 경로 | 설명 |
|--------|------|------|
| `GET` | `/api/todos` | 모든 할 일 조회 |
| `POST` | `/api/todos` | 새 할 일 추가 |
| `PATCH` | `/api/todos/:id` | 할 일 수정 |
| `DELETE` | `/api/todos/:id` | 할 일 삭제 |
| `GET` | `/health` | 서버 상태 확인 |

---

## 💾 데이터 저장

### 로컬 개발
- 📁 `server/todos.json` 파일에 저장
- 메모장으로 열어서 직접 확인 가능

### 배포 환경
- 🐘 PostgreSQL 데이터베이스 사용
- Render 무료 DB (90일 제한)
- `DATABASE_URL` 환경변수로 자동 전환

---

## 🛠️ 개발 모드

파일 수정 시 자동 재시작:

```bash
# 서버 개발 모드 (파일 감지)
cd server
npm run dev

# 프론트엔드 (HMR 자동 지원)
cd todo
npm run dev
```

---

## 🌐 배포하기

### 배포 가이드
상세한 배포 방법은 [README_DEPLOY.md](README_DEPLOY.md)를 참고하세요!

**배포 플랫폼:**
- **프론트엔드**: Vercel (무료)
- **백엔드**: Render (무료)
- **데이터베이스**: Render PostgreSQL (무료)

**배포 후 친구들과 공유:**
```
https://your-todo-app.vercel.app
```

---

## ❓ 문제 해결

### 서버가 안 켜져요
- `server/` 폴더에서 `npm install` 했는지 확인
- 포트 3001이 이미 사용 중인지 확인
- `node --version` 으로 Node.js 설치 확인

### 프론트엔드에서 데이터가 안 불러와져요
- 서버가 실행 중인지 확인: `http://localhost:3001/api/todos` 접속
- 브라우저 콘솔(F12)에서 에러 확인
- CORS 에러 시 서버 재시작

### 배포 후 데이터가 안 보여요
- Render 대시보드 → Logs 확인
- Vercel 대시보드 → Deployment Logs 확인
- 환경변수 `DATABASE_URL`, `VITE_API_URL` 확인

---

## 📖 더 알아보기

- [프론트엔드 상세 설명](todo/README.md)
- [서버 상세 설명](server/README.md)
- [배포 가이드](README_DEPLOY.md)

---

## 🎨 기술 스택

| 계층 | 기술 |
|------|------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS v4, Custom CSS Variables |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL (production), JSON (development) |
| **Deployment** | Vercel (frontend), Render (backend) |
| **Tools** | Git, npm |

---

## 📄 라이선스

MIT License

---

## 👥 기여

이슈와 PR은 언제나 환영합니다!
