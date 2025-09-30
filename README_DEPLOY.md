# Todo 앱 배포 가이드 🚀

이 가이드는 Todo 앱을 GitHub + Render + Vercel에 배포하는 방법을 설명합니다.

## 📋 사전 준비

1. **GitHub 계정** - https://github.com
2. **Render 계정** - https://render.com
3. **Vercel 계정** - https://vercel.com

모두 무료로 사용 가능합니다!

---

## 🔧 Phase 1: GitHub에 코드 업로드

### 1단계: Git 초기화

```bash
git init
git add .
git commit -m "Initial commit: Todo app with PostgreSQL support"
```

### 2단계: GitHub 저장소 생성

1. https://github.com/new 접속
2. Repository name: `todo-app`
3. Public 선택
4. Create repository 클릭

### 3단계: GitHub에 푸시

```bash
git remote add origin https://github.com/당신의아이디/todo-app.git
git branch -M main
git push -u origin main
```

---

## 🗄️ Phase 2: Render에 백엔드 배포

### 1단계: PostgreSQL 데이터베이스 생성

1. Render 대시보드 → **New +** → **PostgreSQL**
2. 설정:
   - Name: `todo-db`
   - Database: `todo`
   - User: `todo`
   - Region: Singapore (또는 가까운 지역)
   - Plan: Free
3. **Create Database** 클릭
4. **Internal Database URL** 복사 (나중에 사용)

### 2단계: 백엔드 서버 배포

1. Render 대시보드 → **New +** → **Web Service**
2. Connect GitHub → `todo-app` 저장소 선택
3. 설정:
   - Name: `todo-server`
   - Region: Singapore
   - Branch: `main`
   - Root Directory: `server`
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Free
4. **Environment Variables** 추가:
   ```
   DATABASE_URL = [1단계에서 복사한 Internal Database URL]
   NODE_ENV = production
   ```
5. **Create Web Service** 클릭

### 3단계: 서버 URL 확인

배포 완료 후 URL 확인:
```
https://todo-server-xxxx.onrender.com
```

이 URL을 복사하세요! (프론트엔드에서 사용)

---

## 🎨 Phase 3: Vercel에 프론트엔드 배포

### 1단계: Vercel에 프로젝트 연결

1. https://vercel.com 로그인
2. **Add New** → **Project**
3. GitHub에서 `todo-app` 선택
4. **Import** 클릭

### 2단계: 프로젝트 설정

1. Framework Preset: `Vite` 자동 선택
2. Root Directory: `todo`
3. Build and Output Settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`

### 3단계: 환경 변수 설정

**Environment Variables** 추가:
```
VITE_API_URL = https://todo-server-xxxx.onrender.com
```
(Phase 2-3에서 복사한 서버 URL)

### 4단계: 배포

**Deploy** 클릭!

배포 완료 후 URL:
```
https://todo-app-xxxx.vercel.app
```

---

## ✅ Phase 4: 테스트

### 1. 프론트엔드 접속

```
https://todo-app-xxxx.vercel.app
```

### 2. 할 일 추가/삭제 테스트

### 3. 브라우저 개발자 도구 (F12) 확인

- Network 탭에서 API 요청 확인
- 에러가 없는지 확인

---

## 🎉 완료!

이제 친구에게 URL을 공유하세요:
```
https://todo-app-xxxx.vercel.app
```

---

## 🔄 코드 업데이트 방법

코드를 수정한 후:

```bash
git add .
git commit -m "업데이트 내용"
git push
```

→ Render와 Vercel이 자동으로 재배포!

---

## 🐛 문제 해결

### 서버가 느려요
- Render 무료 플랜은 15분 미사용 시 슬립 모드
- 첫 요청 시 15초 정도 대기

### 데이터가 안 보여요
1. Render 대시보드 → Logs 확인
2. Vercel 대시보드 → Deployment Logs 확인
3. 브라우저 F12 → Console 탭 확인

### CORS 에러
- 서버의 `server.js`에 `app.use(cors())` 확인
- 환경 변수 `VITE_API_URL` 확인

---

## 💡 유용한 팁

### Render 무료 DB는 90일 후 만료
- 90일 전에 데이터 백업 필요
- 또는 유료 플랜 ($7/월) 전환

### 커스텀 도메인 연결 (선택)
- Vercel: Settings → Domains
- 자신의 도메인 연결 가능

---

## 📞 도움이 필요하면

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- 이슈 발생 시 GitHub Issues 활용

