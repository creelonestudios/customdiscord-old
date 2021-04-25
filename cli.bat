@echo off
goto ask

:ask
cls
git status
echo.
echo --------------------------------
echo What to do?
echo pull ^| push ^| switch ^| merge
echo.
set "ans=none"
set /p "ans=> "
if %ans% EQU pull goto pull
if %ans% EQU push goto push
if %ans% EQU switch goto switch
if %ans% EQU merge goto merge
goto ask

:pull
git pull
pause >nul
goto ask

:push
git add .
git pull
:ask
cls
set /p "title=title: "
if "%title%." EQU "." goto ask
git commit -m "%title%"
git push
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
git push
echo Merging with ext
git switch ext
git pull
git merge main
git push
echo Merging with website
git switch website
git pull
git merge main
git push
pause >nul
goto ask

