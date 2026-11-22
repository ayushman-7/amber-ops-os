@echo off
title Amber Product Ops OS - Dev Server
echo ========================================================
echo   Starting Amber Product Ops OS Control Tower...
echo ========================================================
echo.
set PATH=C:\Users\KIIT\AppData\Local\Programs\node;%PATH%
echo Opening browser at http://localhost:5173/amber-ops-os/ ...
start http://localhost:5173/amber-ops-os/
echo Starting Vite Development Server...
npm run dev
