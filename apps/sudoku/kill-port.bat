@echo off
setlocal enabledelayedexpansion

REM Kill any process on port 5173
netstat -ano | findstr :5173 > nul
if !errorlevel! equ 0 (
  for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do taskkill /pid %%a /f
)

echo Port 5173 is now available
