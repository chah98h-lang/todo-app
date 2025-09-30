@echo off
echo ========================================
echo   Todo 앱 시작 (프론트엔드만)
echo ========================================
echo.
echo 주의: 서버가 실행 중이어야 합니다!
echo 서버 실행: start_server.cmd 를 더블클릭 하세요
echo.
pause

setlocal

set PORT=5174
set NODEPM="%ProgramFiles%\nodejs\npm.cmd"
set CHROME="%ProgramFiles%\Google\Chrome\Application\chrome.exe"

rem Change to this repo's nested app directory
cd /d "%~dp0todo"

echo 프론트엔드를 시작합니다...
echo.

rem Start Vite dev server in background in the same (hidden) window
start "" /b %NODEPM% run dev -- --port %PORT%

rem Give the server a moment to boot
timeout /t 3 /nobreak >nul

rem Open in Chrome if present; otherwise use default handler
if exist %CHROME% (
  start "" %CHROME% http://localhost:%PORT%
) else (
  start "" http://localhost:%PORT%
)

endlocal