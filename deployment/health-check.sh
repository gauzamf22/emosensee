#!/bin/bash

# Emosense Health Check Script

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

VPS_IP="43.129.58.246"
BACKEND_URL="http://$VPS_IP/api"
FRONTEND_URL="http://$VPS_IP"

echo -e "${YELLOW}=== Emosense Health Check ===${NC}"
echo ""

# Check PM2 status
echo -e "${YELLOW}[1/5] PM2 Status${NC}"
pm2 status emosense-backend
PM2_STATUS=$?
if [ $PM2_STATUS -eq 0 ]; then
    echo -e "${GREEN}✓ PM2 running${NC}"
else
    echo -e "${RED}✗ PM2 not running${NC}"
fi
echo ""

# Check nginx status
echo -e "${YELLOW}[2/5] Nginx Status${NC}"
sudo systemctl status nginx --no-pager | head -3
NGINX_STATUS=$(sudo systemctl is-active nginx)
if [ "$NGINX_STATUS" = "active" ]; then
    echo -e "${GREEN}✓ Nginx active${NC}"
else
    echo -e "${RED}✗ Nginx not active${NC}"
fi
echo ""

# Check backend health endpoint
echo -e "${YELLOW}[3/5] Backend Health${NC}"
BACKEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/health" --max-time 5)
if [ "$BACKEND_HEALTH" = "200" ]; then
    echo -e "${GREEN}✓ Backend responding (HTTP $BACKEND_HEALTH)${NC}"
else
    echo -e "${RED}✗ Backend not responding (HTTP $BACKEND_HEALTH)${NC}"
fi
echo ""

# Check frontend
echo -e "${YELLOW}[4/5] Frontend${NC}"
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL" --max-time 5)
if [ "$FRONTEND_STATUS" = "200" ]; then
    echo -e "${GREEN}✓ Frontend responding (HTTP $FRONTEND_STATUS)${NC}"
else
    echo -e "${RED}✗ Frontend not responding (HTTP $FRONTEND_STATUS)${NC}"
fi
echo ""

# Check AI endpoints
echo -e "${YELLOW}[5/5] AI Endpoints${NC}"
echo "Testing /api/ai/analyze-emotion..."
AI_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/ai/analyze-emotion" --max-time 5)
if [ "$AI_STATUS" = "405" ] || [ "$AI_STATUS" = "400" ] || [ "$AI_STATUS" = "200" ]; then
    echo -e "${GREEN}✓ AI endpoint reachable (HTTP $AI_STATUS)${NC}"
else
    echo -e "${RED}✗ AI endpoint not reachable (HTTP $AI_STATUS)${NC}"
fi
echo ""

# Summary
echo -e "${YELLOW}=== Summary ===${NC}"
echo "Frontend: $FRONTEND_URL"
echo "Backend API: $BACKEND_URL"
echo "PM2 Logs: /home/ubuntu/emosensee/deployment/logs/"
echo ""
echo "Commands:"
echo "  pm2 logs emosense-backend  # View logs"
echo "  pm2 restart emosense-backend  # Restart backend"
echo "  sudo nginx -t  # Test nginx config"
echo "  sudo systemctl reload nginx  # Reload nginx"
