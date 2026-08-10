#!/bin/bash
set -e

echo "=========================================="
echo "  BHARTI GREEN TECH - Server Auto-Setup"
echo "=========================================="

echo "[1/5] Updating packages and installing Node.js, Git, and Nginx..."
apt update -y
apt install -y git nodejs npm nginx curl
npm install -g pm2

echo "[2/5] Setting up project directory at /var/www/greentech..."
mkdir -p /var/www
cd /var/www
if [ -d "greentech" ]; then
  cd greentech
  git pull origin main
else
  git clone https://github.com/aditiyelpale20/greentech.git
  cd greentech
fi

echo "[3/5] Installing project dependencies..."
npm install

echo "[4/5] Starting application via PM2..."
pm2 delete greentech 2>/dev/null || true
pm2 start server.js --name "greentech"
pm2 save
pm2 startup || true

echo "[5/5] Configuring Nginx reverse proxy on port 80..."
cat << 'EOF' > /etc/nginx/sites-available/greentech
server {
    listen 80;
    server_name 64.118.137.163;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

ln -sf /etc/nginx/sites-available/greentech /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx

echo "=========================================="
echo "  DEPLOYMENT COMPLETE!"
echo "  Your website is live at: http://64.118.137.163"
echo "=========================================="
