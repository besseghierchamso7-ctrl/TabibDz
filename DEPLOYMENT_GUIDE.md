# TABIB DZ - Production Deployment Guide

## Overview
Complete guide for deploying TABIB DZ to production with Docker, ensuring scalability, security, and reliability.

---

## Pre-Deployment Checklist

### ✅ Code Preparation
- [ ] All features tested locally
- [ ] Environment variables documented
- [ ] Error logging configured
- [ ] Rate limiting tested
- [ ] Database backups created
- [ ] Dependencies locked (package-lock.json)

### ✅ Security
- [ ] All API keys in .env
- [ ] CORS configured for production domains
- [ ] Rate limiting enabled
- [ ] Helmet security headers active
- [ ] Input validation enabled
- [ ] SQL injection protection enabled
- [ ] HTTPS enforced

### ✅ Performance
- [ ] Database indexes verified
- [ ] Caching strategy configured
- [ ] CDN configured (for static assets)
- [ ] Gzip compression enabled
- [ ] Image optimization done
- [ ] Load test completed

---

## Docker Setup

### Backend Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["node", "server.js"]
```

### Frontend Dockerfile
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose File
```yaml
version: '3.8'

services:
  # MongoDB
  mongo:
    image: mongo:7.0
    container_name: tabib_mongo
    environment:
      MONGO_INITDB_DATABASE: tabib_dz
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD}
    volumes:
      - mongo_data:/data/db
      - ./init-mongo.js:/docker-entrypoint-initdb.d/init-mongo.js
    ports:
      - "27017:27017"
    networks:
      - tabib_network
    healthcheck:
      test: echo 'db.adminCommand("ping")' | mongosh -u root -p ${MONGO_ROOT_PASSWORD} localhost:27017/test
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: tabib_backend
    environment:
      NODE_ENV: production
      MONGO_URI: mongodb://root:${MONGO_ROOT_PASSWORD}@mongo:27017/tabib_dz?authSource=admin
      JWT_SECRET: ${JWT_SECRET}
      EMAIL_USER: ${EMAIL_USER}
      EMAIL_PASSWORD: ${EMAIL_PASSWORD}
      TWILIO_ACCOUNT_SID: ${TWILIO_ACCOUNT_SID}
      TWILIO_AUTH_TOKEN: ${TWILIO_AUTH_TOKEN}
      TWILIO_PHONE_NUMBER: ${TWILIO_PHONE_NUMBER}
      TWILIO_WHATSAPP_NUMBER: ${TWILIO_WHATSAPP_NUMBER}
      VITE_API_URL: ${API_URL}
    ports:
      - "5000:5000"
    depends_on:
      mongo:
        condition: service_healthy
    networks:
      - tabib_network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    restart: unless-stopped

  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: tabib_frontend
    environment:
      VITE_API_URL: ${API_URL}
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./frontend/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certs:/etc/nginx/certs:ro
    depends_on:
      - backend
    networks:
      - tabib_network
    restart: unless-stopped

  # Redis (optional - for caching)
  redis:
    image: redis:7-alpine
    container_name: tabib_redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - tabib_network
    restart: unless-stopped

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: tabib_nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certs:/etc/nginx/certs:ro
    depends_on:
      - backend
      - frontend
    networks:
      - tabib_network
    restart: unless-stopped

volumes:
  mongo_data:
  redis_data:

networks:
  tabib_network:
    driver: bridge
```

---

## Environment Configuration

### Production .env
```env
# App
NODE_ENV=production
PORT=5000
LOG_LEVEL=info

# Database
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/tabib_dz?retryWrites=true&w=majority
MONGO_ROOT_PASSWORD=strong_password_here

# JWT
JWT_SECRET=very_long_random_string_at_least_32_characters
JWT_EXPIRE=7d
REFRESH_TOKEN_EXPIRE=30d

# Email (Gmail)
EMAIL_USER=noreply@tabib.dz
EMAIL_PASSWORD=gmail_app_password_here

# SMS/WhatsApp (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+213912345678
TWILIO_WHATSAPP_NUMBER=+213912345678

# Frontend
VITE_API_URL=https://api.tabib.dz
FRONTEND_URL=https://tabib.dz

# Redis (optional)
REDIS_URL=redis://redis:6379

# Security
CORS_ORIGINS=https://tabib.dz,https://www.tabib.dz,https://admin.tabib.dz
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# AWS S3 (for file uploads)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=tabib-uploads
```

---

## Deployment Steps

### 1. Server Preparation
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install -y docker-compose

# Create app directory
sudo mkdir -p /opt/tabib-dz
cd /opt/tabib-dz
```

### 2. Clone Repository
```bash
git clone https://github.com/your-org/tabib-dz.git .
cd /opt/tabib-dz
```

### 3. Configure Environment
```bash
# Create .env file
sudo nano .env

# Add all production variables
# Save and exit (Ctrl+X, Y, Enter)

# Set permissions
sudo chmod 600 .env
```

### 4. SSL Certificate Setup
```bash
# Using Let's Encrypt with Certbot
sudo apt install -y certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --standalone -d tabib.dz -d www.tabib.dz -d api.tabib.dz

# Auto-renewal
sudo systemctl enable certbot.timer
```

### 5. Build and Deploy
```bash
# Navigate to project directory
cd /opt/tabib-dz

# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Check health
curl http://localhost:5000/api/health
```

### 6. Database Initialization
```bash
# Seed initial data
docker-compose exec backend node scripts/seed.js

# Verify connection
docker-compose exec mongo mongosh -u root -p $MONGO_ROOT_PASSWORD --eval "db.users.countDocuments()"
```

---

## Nginx Configuration

### nginx.conf
```nginx
upstream backend {
    server backend:5000;
    keepalive 32;
}

upstream frontend {
    server frontend:80;
}

# Rate limiting
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=app_limit:10m rate=30r/s;

server {
    listen 80;
    server_name tabib.dz www.tabib.dz;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tabib.dz www.tabib.dz;

    # SSL configuration
    ssl_certificate /etc/nginx/certs/fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/json application/javascript;
    gzip_min_length 1000;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        limit_req zone=app_limit burst=50 nodelay;
    }
}

server {
    listen 443 ssl http2;
    server_name api.tabib.dz;

    # SSL configuration
    ssl_certificate /etc/nginx/certs/fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Content-Type-Options "nosniff" always;

    # API
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Connection "";

        # Rate limiting
        limit_req zone=api_limit burst=20 nodelay;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # WebSocket support
    location /socket.io {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

## Monitoring & Logging

### Docker Logging
```bash
# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Health Checks
```bash
# Backend health
curl https://api.tabib.dz/api/health

# Database health
curl https://api.tabib.dz/api/health/database

# Frontend health
curl https://tabib.dz/
```

### Monitoring Stack (Optional)
```yaml
# Add to docker-compose.yml
prometheus:
  image: prom/prometheus:latest
  volumes:
    - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
    - prometheus_data:/prometheus
  ports:
    - "9090:9090"

grafana:
  image: grafana/grafana:latest
  environment:
    GF_SECURITY_ADMIN_PASSWORD: admin
  ports:
    - "3000:3000"
  volumes:
    - grafana_data:/var/lib/grafana
```

---

## Backup Strategy

### Automated Daily Backup
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/tabib-dz"

mkdir -p $BACKUP_DIR

# MongoDB backup
docker-compose exec mongo mongodump \
  --uri="mongodb://root:password@mongo:27017" \
  --authenticationDatabase="admin" \
  --out=$BACKUP_DIR/mongo_$DATE

# Database dump to S3
aws s3 cp $BACKUP_DIR/mongo_$DATE s3://tabib-backups/ --recursive

# Cleanup old backups (keep 30 days)
find $BACKUP_DIR -mtime +30 -delete

echo "Backup completed: $DATE"
```

### Restore from Backup
```bash
# Restore from backup
docker-compose exec mongo mongorestore \
  --uri="mongodb://root:password@mongo:27017" \
  --authenticationDatabase="admin" \
  /backups/mongo_backup_date
```

---

## Scaling & Performance

### Horizontal Scaling
```yaml
# Scale backend to multiple instances
version: '3.8'
services:
  backend:
    deploy:
      replicas: 3
    environment:
      - NODE_ENV=production
```

### Load Balancing
```bash
# Use round-robin DNS or Nginx upstream
upstream backend {
    server backend1:5000 weight=1;
    server backend2:5000 weight=1;
    server backend3:5000 weight=1;
    keepalive 32;
}
```

### Caching Strategy
```javascript
// Enable Redis caching
const redis = require('redis');
const client = redis.createClient();

app.get('/api/doctors', async (req, res) => {
  const cached = await client.get('doctors');
  if (cached) return res.json(JSON.parse(cached));
  
  const doctors = await Doctor.find();
  await client.setEx('doctors', 3600, JSON.stringify(doctors)); // 1 hour cache
  res.json(doctors);
});
```

---

## Troubleshooting

### Common Issues

**Container won't start**
```bash
# Check logs
docker-compose logs backend

# Verify environment variables
docker-compose config | grep MONGO_URI

# Rebuild container
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

**Database connection timeout**
```bash
# Check MongoDB health
docker-compose exec mongo mongosh -u root -p password

# Check network connectivity
docker-compose exec backend ping mongo
```

**High memory usage**
```bash
# Check resource usage
docker stats

# Limit memory in docker-compose
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 512M
```

---

## Security Hardening

### 1. Enable Firewall
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 2. Fail2Ban (DDoS Protection)
```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban
```

### 3. System Updates
```bash
# Automatic updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## Monitoring Commands

```bash
# Health check all services
docker-compose exec backend curl http://localhost:5000/api/health
docker-compose exec mongo mongosh --eval "db.adminCommand('ping')"

# View database size
docker-compose exec mongo mongosh -u root -p password --eval "db.stats()"

# Check disk space
docker system df

# View container statistics
docker stats

# Check network connectivity
docker network inspect tabib_network
```

---

**Last Updated**: 2026-06-15
**Status**: Production-Ready
**Version**: 1.0.0-stable
