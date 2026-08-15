@echo off
echo ===================================================
echo   BHARTI GREEN TECH - Remote VM Sync Script
echo ===================================================
echo.
echo Connecting to server: 64.118.137.163 as root...
echo When prompted, enter your server password: @Vaishu2
echo.

ssh -t root@64.118.137.163 "cd /var/www/greentech && git fetch origin && git reset --hard origin/main && npm install && pm2 restart greentech && echo '=== SYNC AND RESTART COMPLETED! ==='"

echo.
pause


certbot --nginx -d avya.gen.in -d www.avya.gen.in