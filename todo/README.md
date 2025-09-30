# 할 일 리스트 (Todo)

간단하고 아름다운 할 일 관리 웹앱입니다. 브라우저의 로컬 저장소(LocalStorage)에 저장되므로 설치나 서버 없이 바로 사용할 수 있습니다.

## 실행 방법 (React + Vite)
PowerShell에서 아래 명령을 순서대로 실행하세요:

```powershell
cd todo
npm install
npm run dev
```

브라우저가 자동으로 열리지 않으면 `http://localhost:5173`로 접속하세요.

## 기능
- 새 할 일 추가 (Enter 또는 추가 버튼)
- 완료/미완료 체크 토글
- 더블클릭 또는 연필 아이콘으로 텍스트 편집
- 휴지통 아이콘으로 삭제
- 필터: 모두/진행중/완료
- 완료 항목 일괄 삭제
- 드래그 앤 드롭으로 순서 변경
- 로컬 저장소에 자동 저장 및 복원

## 폴더 구조
- `todo/index.html`: Vite 진입 HTML
- `todo/src/main.tsx`: React 엔트리
- `todo/src/App.tsx`: 주요 UI/로직
- `todo/styles.css`: 스타일
- `todo/package.json`: 스크립트/의존성

## 데이터 보관 위치
- 이 앱은 서버와 통신하지 않으며, 브라우저 `localStorage`에만 데이터를 저장합니다. 같은 브라우저/기기에서만 목록이 유지됩니다.

## 라이선스
- MIT
