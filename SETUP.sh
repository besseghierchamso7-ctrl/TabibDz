#!/bin/bash
# TABIB DZ - INSTALLATION & SETUP GUIDE

echo "================================"
echo "TABIB DZ Platform Setup"
echo "================================"

# Backend Setup
echo "📦 Installing Backend Dependencies..."
cd backend
npm install nodemailer twilio dotenv
npm install --save-dev

# Add these to .env
echo "
# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# SMS/WhatsApp Configuration (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=+1234567890

# MongoDB
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/tabib_dz

# JWT
JWT_SECRET=your_jwt_secret_key

# Frontend
VITE_API_URL=http://localhost:5000/api
" > .env

echo "✅ Backend setup complete"

# Frontend Setup
echo "📦 Installing Frontend Dependencies..."
cd ../frontend
npm install i18next i18next-browser-languagedetector i18next-http-backend
npm install

echo "✅ Frontend setup complete"

echo ""
echo "================================"
echo "📋 NEXT STEPS"
echo "================================"
echo "1. Fill in .env with your credentials"
echo "2. Run: npm run seed (backend) - to seed admin user"
echo "3. Run: npm run dev (backend) - port 5000"
echo "4. Run: npm run dev (frontend) - port 5173"
echo "5. Test at: http://localhost:5173"
echo ""
echo "================================"
echo "🔑 Admin Credentials (After Seed)"
echo "================================"
echo "Email: admin@tabib.dz"
echo "Password: Admin@123"
echo "================================"
