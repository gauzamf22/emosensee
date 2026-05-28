#!/bin/bash

# Emosense Deployment Script
# VPS IP: 43.129.58.246

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Config
PROJECT_DIR="/home/ubuntu/emosensee"
BACKEND_DIR="$PROJECT_DIR/backend"
DEPLOYMENT_DIR="$PROJECT_DIR/deployment"
NGINX_CONFIG="$DEPLOYMENT_DIR/nginx-emosense.conf"
PM2_CONFIG="$DEPLOYMENT_DIR/ecosystem.config.js"
VPS_IP="43.129.58.246"
BACKUP_DIR="$PROJECT_DIR/deployment/backups/$(date +%Y%m%d_%H%M%S)"

echo -e "${GREEN}=== Emosense Deployment ===${NC}"
echo "VPS IP: $VPS_IP"
echo "Project: $PROJECT_DIR"
echo ""

# Pre-deployment checks
echo -e "${YELLOW}[1/8] Pre-deployment checks...${NC}"

# Check if running as correct user
if [ "$USER" != "ubuntu" ]; then
    echo -e "${RED}Error: Must run as ubuntu user${NC}"
    exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js not installed${NC}"
    exit 1
fi
echo "✓ Node.js $(node -v)"

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}Error: pnpm not installed${NC}"
    exit 1
fi
echo "✓ pnpm $(pnpm -v)"

# Check nginx
if ! command -v nginx &> /dev/null; then
    echo -e "${RED}Error: nginx not installed${NC}"
    exit 1
fi
echo "✓ nginx $(nginx -v 2>&1 | grep -oP 'nginx/\K[0-9.]+')"

# Check if PM2 is installed, install if not
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}Installing PM2...${NC}"
    npm install -g pm2
fi
echo "✓ PM2 $(pm2 -v)"

# Create backup directory
echo -e "${YELLOW}[2/8] Creating backup...${NC}"
mkdir -p "$BACKUP_DIR"

# Backup existing configs
if [ -f "/etc/nginx/sites-available/mitbridge" ]; then
    sudo cp /etc/nginx/sites-available/mitbridge "$BACKUP_DIR/nginx-mitbridge.conf.bak"
    echo "✓ Backed up nginx mitbridge config"
fi

if [ -f "$PROJECT_DIR/.env" ]; then
    cp "$PROJECT_DIR/.env" "$BACKUP_DIR/.env.frontend.bak"
    echo "✓ Backed up frontend .env"
fi

if [ -f "$BACKEND_DIR/.env" ]; then
    cp "$BACKEND_DIR/.env" "$BACKUP_DIR/.env.backend.bak"
    echo "✓ Backed up backend .env"
fi

if [ -f "$BACKEND_DIR/src/app.js" ]; then
    cp "$BACKEND_DIR/src/app.js" "$BACKUP_DIR/app.js.bak"
    echo "✓ Backed up backend app.js"
fi

# Stop existing processes
echo -e "${YELLOW}[3/8] Stopping existing processes...${NC}"

# Kill screen session if exists
SCREEN_PID=$(ps aux | grep 'SCREEN.*emosense\|screen.*backend' | grep -v grep | awk '{print $2}' | head -1)
if [ ! -z "$SCREEN_PID" ]; then
    kill $SCREEN_PID 2>/dev/null || true
    echo "✓ Killed screen session (PID: $SCREEN_PID)"
fi

# Stop PM2 processes if any
pm2 delete emosense-backend 2>/dev/null || true
echo "✓ Stopped PM2 processes"

# Update environment files
echo -e "${YELLOW}[4/8] Updating environment files...${NC}"

# Update frontend .env
cat > "$PROJECT_DIR/.env" << EOF
VITE_API_BASE_URL=http://$VPS_IP
EOF
echo "✓ Updated frontend .env"

# Update backend CORS in app.js
echo -e "${YELLOW}[5/8] Updating backend CORS...${NC}"
sed -i "s|origin: \[.*\]|origin: ['http://localhost:5175', 'http://localhost:5174', 'http://localhost:5173', 'http://localhost:3000', 'http://$VPS_IP']|" "$BACKEND_DIR/src/app.js"
echo "✓ Updated CORS to include $VPS_IP"

# Install dependencies and build
echo -e "${YELLOW}[6/8] Installing dependencies and building...${NC}"

cd "$PROJECT_DIR"
echo "Installing frontend dependencies..."
pnpm install --frozen-lockfile

echo "Building frontend (timeout: 300s)..."
timeout 300 pnpm run build || {
    echo -e "${RED}Build failed or timed out${NC}"
    exit 1
}
echo "✓ Frontend built successfully"

cd "$BACKEND_DIR"
echo "Installing backend dependencies..."
pnpm install --frozen-lockfile
echo "✓ Backend dependencies installed"

# Configure nginx
echo -e "${YELLOW}[7/8] Configuring nginx...${NC}"

# Disable mitbridge config
if [ -L "/etc/nginx/sites-enabled/mitbridge" ]; then
    sudo rm /etc/nginx/sites-enabled/mitbridge
    echo "✓ Disabled mitbridge config"
fi

# Copy new config
sudo cp "$NGINX_CONFIG" /etc/nginx/sites-available/emosense
sudo ln -sf /etc/nginx/sites-available/emosense /etc/nginx/sites-enabled/emosense

# Test nginx config
sudo nginx -t || {
    echo -e "${RED}Nginx config test failed${NC}"
    exit 1
}
echo "✓ Nginx config valid"

# Reload nginx
sudo systemctl reload nginx
echo "✓ Nginx reloaded"

# Start backend with PM2
echo -e "${YELLOW}[8/8] Starting backend with PM2...${NC}"
cd "$BACKEND_DIR"
pm2 start "$PM2_CONFIG"
pm2 save
echo "✓ Backend started with PM2"

# Final status
echo ""
echo -e "${GREEN}=== Deployment Complete ===${NC}"
echo ""
echo "Frontend: http://$VPS_IP"
echo "Backend API: http://$VPS_IP/api"
echo ""
echo "PM2 Status:"
pm2 status
echo ""
echo "Run health check: bash $DEPLOYMENT_DIR/health-check.sh"
echo "Rollback if needed: bash $DEPLOYMENT_DIR/rollback.sh"
