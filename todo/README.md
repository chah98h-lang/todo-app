# 할 일 리스트 프론트엔드 (Todo Frontend)

React + TypeScript + Vite로 만든 아름다운 할 일 관리 웹앱입니다.  
**서버 API와 통신**하여 데이터를 저장하므로 여러 기기에서 동기화됩니다.

---

## 🚀 실행 방법

### 사전 준비
**백엔드 서버가 먼저 실행되어야 합니다!**

```bash
# 먼저 다른 터미널에서 서버 실행
cd server
npm install
npm start
```

### 프론트엔드 실행
```bash
cd todo
npm install
npm run dev
```

브라우저가 자동으로 열리지 않으면 `http://localhost:5173`로 접속하세요.

---

## ✨ 주요 기능

### 할 일 관리
- ✅ 새 할 일 추가 (Enter 또는 추가 버튼)
- ✏️ 더블클릭 또는 연필 아이콘으로 인라인 편집
- 🗑️ 휴지통 아이콘으로 삭제
- ☑️ 완료/미완료 체크 토글

### UI/UX
- 🔍 필터: 모두/진행중/완료
- 🧹 완료 항목 일괄 삭제
- 🖱️ 드래그 앤 드롭으로 순서 변경
- 🌓 다크모드 자동 전환 (시스템 설정 감지)
- 📱 반응형 디자인 (모바일 대응)

### 기술적 특징
- ⚡ Vite HMR (Hot Module Replacement)
- 🔄 낙관적 UI 업데이트 (Optimistic Updates)
- 🎯 TypeScript 타입 안전성
- 🚀 React 18 최신 기능 활용

---

## 📁 폴더 구조

```
todo/
├── src/
│   ├── App.tsx       # 메인 컴포넌트 (UI + 로직)
│   ├── api.ts        # 서버 API 통신 레이어
│   └── main.tsx      # React 진입점
├── index.html        # Vite 진입 HTML
├── styles.css        # Todoist 스타일 CSS
├── vite.config.ts    # Vite 설정
├── tsconfig.json     # TypeScript 설정
└── package.json      # 의존성 및 스크립트
```

---

## 🔌 서버 통신

### API 엔드포인트
프론트엔드는 다음 API와 통신합니다:

- `GET /api/todos` - 모든 할 일 가져오기
- `POST /api/todos` - 새 할 일 추가
- `PATCH /api/todos/:id` - 할 일 수정
- `DELETE /api/todos/:id` - 할 일 삭제

### 환경변수 설정 (배포용)
로컬에서는 `http://localhost:3001`을 기본으로 사용하지만,  
배포 시 서버 URL을 환경변수로 설정할 수 있습니다:

`.env` 파일 생성:
```env
VITE_API_URL=https://your-server.onrender.com
```

Vercel 배포 시 환경변수:
```
VITE_API_URL = https://your-server.onrender.com
```

---

## 💾 데이터 저장 위치

### 로컬 개발
- 서버의 `todos.json` 파일에 저장

### 배포 환경
- PostgreSQL 데이터베이스에 저장
- 여러 사용자가 동일한 데이터에 접근 가능

**참고**: 이 앱은 서버와 통신하므로 인터넷 연결이 필요합니다.

---

## 🎨 스타일 커스터마이징

`styles.css`에서 CSS 변수로 쉽게 테마 변경 가능:

```css
:root {
  --primary: #db4c3f;      /* 메인 컬러 */
  --bg: #fafafa;           /* 배경색 */
  --panel: #ffffff;        /* 카드 배경 */
  --text: #202020;         /* 텍스트 */
}
```

다크모드는 `@media (prefers-color-scheme: dark)`로 자동 전환됩니다.

---

## 🛠️ 개발 명령어

```bash
# 개발 서버 실행 (HMR 지원)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

---

## 📦 주요 의존성

- **react** ^18.3.1 - UI 라이브러리
- **react-dom** ^18.3.1 - React DOM 렌더링
- **vite** ^5.4.0 - 빌드 도구
- **@vitejs/plugin-react** - JSX 지원
- **tailwindcss** ^4.1.12 - CSS 프레임워크
- **typescript** - 타입 체크

---

## 🚀 배포

### Vercel 배포 (권장)
1. GitHub에 코드 푸시
2. Vercel에서 프로젝트 Import
3. Root Directory: `todo`
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. 환경변수 설정: `VITE_API_URL`

자세한 배포 가이드는 [README_DEPLOY.md](../README_DEPLOY.md)를 참고하세요!

---

## ❓ 문제 해결

### 데이터가 안 불러와져요
1. 서버가 실행 중인지 확인: `http://localhost:3001/api/todos`
2. CORS 에러 확인 (F12 콘솔)
3. 서버와 프론트엔드 포트 충돌 확인

### 빌드가 안 돼요
1. `npm install` 다시 실행
2. `node_modules` 삭제 후 재설치
3. Node.js 버전 확인 (v18 이상 권장)

---

## 📄 라이선스

MIT License