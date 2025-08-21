@echo off
echo Parando processos Node.js na porta 3000...

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    echo Finalizando processo %%a
    taskkill /PID %%a /F >nul 2>&1
)

echo Processos finalizados.
pause