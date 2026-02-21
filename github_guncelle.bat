@echo off
echo GitHub'a Guncelleme Gonderiliyor...
git add .
set msg=%~1
if "%~1"=="" set msg="Otomatik guncelleme"
git commit -m %msg%
git push origin main
echo.
echo ==============================================
echo Guncelleme basariyla GitHub'a yuklendi!
echo ==============================================
pause
