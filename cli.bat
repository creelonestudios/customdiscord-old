@echo off
goto ask

:ask
cls
echo What to do?
echo status ^| pull ^| push ^| switch ^| merge
echo.
set "ans=none"
set /p "ans=> "
if %ans% EQU status goto status
if %ans% EQU pull goto pull
if %ans% EQU push goto push
if %ans% EQU switch goto switch
if %ans% EQU merge goto merge
goto invalid

:invalid
echo Invalid.
pause >nul
goto ask

:status
git status
pause >nul
goto ask

:pull
call pull.bat
pause >nul
goto ask

:push
call push.bat
pause >nul
goto ask

:switch
echo Switch :: Which branch do you want to switch to?
set "ans=none"
set /p "ans=> "
if %ans% EQU none goto switch
git switch %ans%
git pull
pause >nul
goto ask

:merge
echo Merge :: Are you sure you want to merge main into ext and website? (y/n)
set "ans=n"
set /p "ans=> "
if %ans% EQU n goto ask
call mergemain.bat
pause >nul
goto ask

