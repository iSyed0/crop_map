@echo off
REM Starts the vegetation API (server/) and the Vite frontend, each in their
REM own window, then opens the app in the default browser.
REM
REM Do NOT open index.html directly or use VS Code "Go Live" on it -- this is
REM a Vite app; the browser needs Vite's dev server to transform the JSX and
REM resolve node_modules imports referenced by /src/main.jsx.

cd /d "%~dp0"

echo Starting vegetation API (server/) on http://localhost:4310 ...
start "Vegetation API (server)" cmd /k "cd /d "%~dp0server" && npm run dev"

echo Starting Vite frontend on http://localhost:5173 ...
start "Frontend (vite)" cmd /k "cd /d "%~dp0" && npm run dev"

echo Waiting for the frontend to come up...
timeout /t 5 /nobreak >nul

start "" "http://localhost:5173"
