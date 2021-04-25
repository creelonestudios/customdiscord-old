@echo off
git add .
git pull
:ask
cls
set /p "title=title: "
if "%title%." EQU "." goto ask
git commit -m "%title%"
git push