@echo off
echo ===================================================
echo   BHARTI GREEN TECH - Remote VM Deployment Script
echo ===================================================
echo.
echo Connecting to server: 64.118.137.163 as root...
echo When prompted, enter your server password: @Vaishu2
echo.

ssh -t root@64.118.137.163 "bash -c 'echo \"=== Setting up Server Dependencies ===\" && apt update && apt install -y git nodejs npm nginx && npm install -g pm2 && mkdir -p /var/www && cd /var/www && rm -rf greentech && git clone https://github.com/aditiyelpale20/greentech.git && cd greentech && npm install && pm2 delete greentech 2>/dev/null || true && pm2 start server.js --name \"greentech\" && pm2 save && pm2 startup && echo \"=== Configuring Nginx Port 80 ===\" && printf \"server {\n    listen 80;\n    server_name 64.118.137.163;\n\n    location / {\n        proxy_pass http://127.0.0.1:3000;\n        proxy_http_version 1.1;\n        proxy_set_header Upgrade \\$http_upgrade;\n        proxy_set_header Connection \\\"upgrade\\\";\n        proxy_set_header Host \\$host;\n        proxy_set_header X-Real-IP \\$remote_addr;\n        proxy_set_header X-Forwarded-For \\$proxy_add_x_forwarded_for;\n        proxy_cache_bypass \\$http_upgrade;\n    }\n}\" > /etc/nginx/sites-available/greentech && ln -sf /etc/nginx/sites-available/greentech /etc/nginx/sites-enabled/ && rm -f /etc/nginx/sites-enabled/default && nginx -t && systemctl restart nginx && echo \"=== DEPLOYMENT COMPLETED! ===\" && echo \"Website is live at: http://64.118.137.163\"'"

echo.
pause
