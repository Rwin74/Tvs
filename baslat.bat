@echo off
echo Hedef: "Yönetim Paneli ve Websitesi Entegrasyonu (Proxy Sunucu)"
echo Yonetim paneli ve site eszamanli baslatiliyor (Lutfen pencereyi kapatmayin)...
cd /d "%~dp0admin-panel"
node server.js
pause
