@echo off
call push.bat
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