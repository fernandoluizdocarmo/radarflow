@echo off
title Servidor Local - Radar de Velocidade Media
cd /d "%~dp0"

echo Iniciando servidor local...

where node >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo Usando Node.js...
    start http://localhost:8000
    node server.js
    goto end
)

where python >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo Usando Python...
    start http://localhost:8000
    python -m http.server 8000
    goto end
)

echo Nem Node.js nem Python foram encontrados no sistema.
pause

:end