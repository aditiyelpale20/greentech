#!/bin/bash
# ==============================================================================
# BHARTI GREEN TECH - Free Let's Encrypt HTTPS / SSL Certificate Installer
# Target Domain: avya.gen.in & www.avya.gen.in
# ==============================================================================

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}======================================================${NC}"
echo -e "${GREEN}   🔒 Installing Free HTTPS / SSL for avya.gen.in     ${NC}"
echo -e "${BLUE}======================================================${NC}"
echo ""

# 1. Install Certbot and Nginx Plugin
echo -e "${YELLOW}[1/3] Installing Certbot SSL engine...${NC}"
apt update -y
apt install -y certbot python3-certbot-nginx

# 2. Obtain SSL Certificate from Let's Encrypt
echo -e "${YELLOW}[2/3] Requesting SSL Certificate from Let's Encrypt...${NC}"
certbot --nginx \
  --non-interactive \
  --agree-tos \
  --register-unsafely-without-email \
  -d avya.gen.in \
  --redirect

# 3. Verify and Reload Nginx
echo -e "${YELLOW}[3/3] Testing Nginx SSL configuration and auto-renewal...${NC}"
nginx -t
systemctl reload nginx

# Test auto-renewal
certbot renew --dry-run || true

echo ""
echo -e "${BLUE}======================================================${NC}"
echo -e "${GREEN}   🎉 HTTPS / SSL IS NOW ACTIVE!                      ${NC}"
echo -e "${BLUE}======================================================${NC}"
echo -e "   🔒 Secure Website: ${GREEN}https://avya.gen.in${NC}"
echo -e "   🔒 Secure Admin:   ${GREEN}https://avya.gen.in/admin${NC}"
echo -e "${BLUE}======================================================${NC}"
