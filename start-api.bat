@echo off
echo Instalando dependencias da API...
npm install

echo.
@echo off
echo Iniciando API CAIXA Emprestimos...
echo.

echo Verificando e liberando porta 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 2^>nul') do (
    if not "%%a"=="" (
        echo Finalizando processo %%a na porta 3000...
        taskkill /PID %%a /F >nul 2>&1
    )
)

echo Aguardando liberacao da porta...
timeout /t 3 /nobreak >nul

echo Iniciando servidor Node.js...
node server.js

pause
npm start