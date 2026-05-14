#!/bin/bash

echo "🚀 AI Stock Market Platform - Quick Setup"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Check if MongoDB is running
if ! command -v mongosh &> /dev/null; then
    echo "⚠️  MongoDB shell (mongosh) not found. Make sure MongoDB is installed."
else
    echo "✅ MongoDB found"
fi

echo ""
echo "📦 Installing dependencies..."
echo ""

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Install server dependencies
echo "Installing server dependencies..."
cd server
npm install
cd ..

# Install client dependencies
echo "Installing client dependencies..."
cd client
npm install
cd ..

echo ""
echo "✅ All dependencies installed!"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Make sure MongoDB is running:"
echo "   Windows: net start MongoDB"
echo "   macOS: brew services start mongodb-community"
echo "   Linux: sudo systemctl start mongod"
echo ""
echo "2. Start the application:"
echo "   npm run dev"
echo ""
echo "3. Open your browser:"
echo "   http://localhost:3000"
echo ""
echo "4. Register a new account and start trading!"
echo ""
echo "📚 For more help, see TROUBLESHOOTING.md"
echo ""
