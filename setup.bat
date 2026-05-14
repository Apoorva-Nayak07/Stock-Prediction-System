@echo off
echo ========================================
echo AI Stock Market Platform - Quick Setup
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

echo [OK] Node.js version:
node --version

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed. Please install npm first.
    exit /b 1
)

echo [OK] npm version:
npm --version

echo.
echo Installing dependencies...
echo.

REM Install root dependencies
echo Installing root dependencies...
call npm install

REM Install server dependencies
echo Installing server dependencies...
cd server
call npm install
cd ..

REM Install client dependencies
echo Installing client dependencies...
cd client
call npm install
cd ..

echo.
echo [OK] All dependencies installed!
echo.
echo Next steps:
echo.
echo 1. Make sure MongoDB is running:
echo    net start MongoDB
echo.
echo 2. Start the application:
echo    npm run dev
echo.
echo 3. Open your browser:
echo    http://localhost:3000
echo.
echo 4. Register a new account and start trading!
echo.
echo For more help, see TROUBLESHOOTING.md
echo.
pause
