@echo off
title Amber Product Ops OS - Production Preview
echo ========================================================
echo   Serving Amber Product Ops OS (Production Build)...
echo ========================================================
echo.
set PATH=C:\Users\KIIT\AppData\Local\Programs\node;%PATH%
echo Opening browser at http://localhost:4173/amber-ops-os/ ...
start http://localhost:4173/amber-ops-os/
npm run preview
