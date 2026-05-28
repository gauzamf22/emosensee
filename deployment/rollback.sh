#!/bin/bash

# Emosense Rollback Script

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PROJECT_DIR="/home/ubuntu/emosensee"
DEPLOYMENT_DIR="$PROJECT_DIR/deployment"

echo -e "${YELLOW}=== Emosense Rollback ===${NC}"
echo ""

# Find latest backup
LATEST_BACKUP=$(ls -td $DEPLOYMENT_DIR/backups/*/ 2>/dev/null | head -1)

if [ -z "$LATEST_BACKUP" ]; then
    echo -e "${RED}No backup found${NC}"
    exit 1
fi

echo "Latest backup: $LATEST_BACKUP"
echo ""
read -p "Rollback to this backup? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Rollback cancelled"
    exit 0
fi

echo -e "${YELLOW}[1/4] Stopping PM2...${NC}"
pm2 delete emosense-backend 2>/dev/null || true
echo "✓ PM2 stopped"

echo -e "${YELLOW}[2/4] Restoring files...${NC}"

# Restore frontend .env
if [ -f "$LATEST_BACKUP/.env.frontend.bak" ]; then
    cp "$LATEST_BACKUP/.env.frontend.bak" "$PROJECT_DIR/.env"
    echo "✓ Restored frontend .env"
fi

# Restore backend .env
if [ -f "$LATEST_BACKUP/.env.backend.bak" ]; then
    cp "$LATEST_BACKUP/.env.backend.bak" "$PROJECT_DIR/backend/.env"
    echo "✓ Restored backend .env"
fi

# Restore backend app.js
if [ -f "$LATEST_BACKUP/app.js.bak" ]; then
    cp "$LATEST_BACKUP/app.js.bak" "$PROJECT_DIR/backend/src/app.js"
    echo "✓ Restored backend app.js"
fi

echo -e "${YELLOW}[3/4] Restoring nginx...${NC}"

# Restore mitbridge config
if [ -f "$LATEST_BACKUP/nginx-mitbridge.conf.bak" ]; then
    sudo cp "$LATEST_BACKUP/nginx-mitbridge.conf.bak" /etc/nginx/sites-available/mitbridge
    sudo ln -sf /etc/nginx/sites-available/mitbridge /etc/nginx/sites-enabled/mitbridge
    echo "✓ Restored mitbridge config"
fi

# Remove emosense config
sudo rm -f /etc/nginx/sites-enabled/emosense
sudo rm -f /etc/nginx/sites-available/emosense
echo "✓ Removed emosense config"

# Test and reload nginx
sudo nginx -t && sudo systemctl reload nginx
echo "✓ Nginx reloaded"

echo -e "${YELLOW}[4/4] Restarting backend in screen...${NC}"
echo "Manual step: Start backend with screen if needed"

echo ""
echo -e "${GREEN}=== Rollback Complete ===${NC}"
echo "Backup restored from: $LATEST_BACKUP"
