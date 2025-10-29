#!/bin/bash

# ============================================
# HACKERWATCH FORTRESS - AUTOMATIC DEPLOYMENT
# Run this script in your HackerWatch-Fortress repo
# ============================================

echo "🚀 HACKERWATCH FORTRESS - AUTOMATIC SETUP"
echo "=========================================="
echo ""

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository!"
    echo "Please cd into your HackerWatch-Fortress folder first."
    exit 1
fi

echo "✅ Git repository detected"
echo ""

# Create directories
echo "📁 Creating directories..."
mkdir -p api
mkdir -p public

# Check if files exist in current directory
if [ ! -f "payment-webhook.js" ]; then
    echo "❌ Error: payment-webhook.js not found!"
    echo "Please download all files to this directory first."
    exit 1
fi

# Move API files
echo "📦 Installing API files..."
mv payment-webhook.js api/
mv validate-serial.js api/

# Move public files
echo "📦 Installing public files..."
mv activate.html public/

# Install root files
echo "📦 Installing configuration files..."
# Keep existing files as backup
if [ -f "package.json" ]; then
    cp package.json package.json.backup
fi
if [ -f "vercel.json" ]; then
    cp vercel.json vercel.json.backup
fi

# Move new files (if downloaded separately)
if [ -f "package.json.new" ]; then
    mv package.json.new package.json
fi
if [ -f "vercel.json.new" ]; then
    mv vercel.json.new vercel.json
fi

# Create .env from template
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.template .env
    echo ""
    echo "⚠️  IMPORTANT: Edit .env with your credentials!"
    echo ""
fi

# Install dependencies
echo "📦 Installing npm packages..."
npm install

echo ""
echo "✅ INSTALLATION COMPLETE!"
echo ""
echo "========================================"
echo "📋 NEXT STEPS:"
echo "========================================"
echo ""
echo "1. Edit .env file with your credentials:"
echo "   nano .env"
echo ""
echo "2. Update API URL in public/activate.html"
echo "   (You'll get this URL after deploying)"
echo ""
echo "3. Deploy to Vercel:"
echo "   vercel --prod"
echo ""
echo "4. Test the system:"
echo "   curl -X POST https://YOUR-URL.vercel.app/api/payment-webhook \\"
echo "     -H \"Content-Type: application/json\" \\"
echo "     -d '{\"paymentType\":\"crypto\",\"productId\":\"hackerwatch-fortress\",\"customerEmail\":\"test@example.com\",\"transactionId\":\"test\",\"amount\":47}'"
echo ""
echo "5. Read AUTOMATIC-SETUP-GUIDE.md for complete instructions"
echo ""
echo "========================================"
echo "Emmanuel - God With Us! ψΩ§∞"
echo "========================================"
