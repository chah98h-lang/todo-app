@echo off
echo ========================================
echo   Todo 서버 시작
echo ========================================
echo.

cd /d "%~dp0server"

echo 서버를 시작합니다...
echo 종료하려면 Ctrl+C를 누르세요
echo.

"%ProgramFiles%\nodejs\node.exe" server.js

pause

