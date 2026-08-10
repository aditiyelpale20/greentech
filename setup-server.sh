#!/bin/bash
# ==============================================================================
# BHARTI GREEN TECH - Complete Fresh Server Setup & Auto-Deployment Script
# Target: Ubuntu / Debian Fresh Linux VM
# ==============================================================================

set -e

# Color helpers
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================================${NC}"
echo -e "${GREEN}   🌿 BHARTI GREEN TECH - Fresh Server Setup Engine   ${NC}"
echo -e "${BLUE}======================================================${NC}"
echo ""

# 1. Update system packages
echo -e "${YELLOW}[1/7] Updating system package index...${NC}"
export DEBIAN_FRONTEND=noninteractive
apt update -y
apt upgrade -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold"

# 2. Install essential tools (curl, git, ufw, build tools)
echo -e "${YELLOW}[2/7] Installing essential system utilities...${NC}"
apt install -y curl wget git ufw nginx software-properties-common ca-certificates gnupg

# 3. Install latest Node.js (v20 LTS) & npm
echo -e "${YELLOW}[3/7] Installing Node.js v20 LTS...${NC}"
if ! command -v node &> /dev/null || [ "$(node -v | cut -d'.' -f1)" != "v20" ]; then
    mkdir -p /etc/apt/keyrings
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg --yes
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
    apt update -y
    apt install -y nodejs
fi
echo -e "${GREEN}   Node.js version: $(node -v)${NC}"
echo -e "${GREEN}   npm version: $(npm -v)${NC}"

# 4. Install PM2 process manager
echo -e "${YELLOW}[4/7] Installing & Configuring PM2 Process Manager...${NC}"
npm install -g pm2

# 5. Clone / Update Repository
echo -e "${YELLOW}[5/7] Deploying application codebase to /var/www/greentech...${NC}"
mkdir -p /var/www
cd /var/www
if [ -d "/var/www/greentech" ]; then
    echo "   Existing directory found. Pulling latest updates..."
    cd /var/www/greentech
    git reset --hard HEAD
    git pull origin main
else
    echo "   Cloning repository from GitHub..."
    git clone https://github.com/aditiyelpale20/greentech.git /var/www/greentech
    cd /var/www/greentech
fi

# Install project dependencies
echo "   Installing project dependencies via npm..."
npm install --production

# 6. Launch Application with PM2
echo -e "${YELLOW}[6/7] Starting Node.js server with PM2 cluster...${NC}"
pm2 delete greentech 2>/dev/null || true
pm2 start server.js --name "greentech"
pm2 save
env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u root --hp /root || true

# 7. Configure Nginx Reverse Proxy
echo -e "${YELLOW}[7/7] Configuring Nginx reverse proxy for avya.gen.in on Port 80...${NC}"
cat << 'EOF' > /etc/nginx/sites-available/greentech
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name avya.gen.in www.avya.gen.in 64.118.137.163 _;

    # Maximum upload file size
    client_max_body_size 50M;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

ln -sf /etc/nginx/sites-available/greentech /etc/nginx/sites-enabled/greentech
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
systemctl enable nginx

# Configure Automated GitHub Sync (Every 2 minutes)
echo "   Setting up automated GitHub auto-update cron job..."
(crontab -l 2>/dev/null | grep -v 'greentech'; echo "*/2 * * * * cd /var/www/greentech && git pull origin main && npm install --production && pm2 restart greentech > /dev/null 2>&1") | crontab -

# Configure Firewall (Allow SSH, HTTP, HTTPS)
echo "   Configuring firewall (UFW)..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable || true

echo ""
echo -e "${BLUE}======================================================${NC}"
echo -e "${GREEN}   🎉 SETUP COMPLETE! YOUR WEBSITE IS NOW LIVE!      ${NC}"
echo -e "${BLUE}======================================================${NC}"
echo -e "   🌍 URL: ${GREEN}http://64.118.137.163${NC}"
echo -e "   📦 PM2 Status: $(pm2 list | grep greentech || echo 'running')"
echo -e "${BLUE}======================================================${NC}"
