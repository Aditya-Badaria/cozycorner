#!/bin/bash

# Cozy Corner - Automated Setup Script
# Run this script to automatically set up the project

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
  echo -e "${BLUE}========================================${NC}"
  echo -e "${BLUE}$1${NC}"
  echo -e "${BLUE}========================================${NC}"
}

print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
  echo -e "${RED}✗ $1${NC}"
}

# Check prerequisites
print_header "Checking Prerequisites"

# Check Node.js
if command -v node &> /dev/null; then
  NODE_VERSION=$(node --version)
  print_success "Node.js installed: $NODE_VERSION"
else
  print_error "Node.js not found. Please install Node.js v16+"
  exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
  NPM_VERSION=$(npm --version)
  print_success "npm installed: $NPM_VERSION"
else
  print_error "npm not found"
  exit 1
fi

# Check MongoDB
if command -v mongosh &> /dev/null; then
  MONGO_VERSION=$(mongosh --version)
  print_success "MongoDB installed: $MONGO_VERSION"
else
  print_warning "MongoDB not installed. Using MongoDB Atlas? Update MONGODB_URI in server/.env"
fi

print_header "Installing Dependencies"

# Install server dependencies
echo ""
echo "📦 Installing server dependencies..."
cd server
npm install
print_success "Server dependencies installed"

# Install client dependencies
echo ""
echo "📦 Installing client dependencies..."
cd ../client
npm install
print_success "Client dependencies installed"

print_header "Checking Environment Files"

# Check server .env
if [ -f "../server/.env" ]; then
  print_success "server/.env exists"
else
  print_warning "server/.env not found"
fi

# Check client .env
if [ -f "./.env" ]; then
  print_success "client/.env exists"
else
  print_warning "client/.env not found"
fi

print_header "Project Setup Complete!"

echo ""
echo -e "${GREEN}🎉 Cozy Corner is ready for development!${NC}"
echo ""
echo "Next steps:"
echo "1. Start MongoDB (if using local):"
echo "   ${YELLOW}brew services start mongodb-community${NC}"
echo ""
echo "2. Open 3 terminals and run:"
echo "   Terminal 1 (Backend):"
echo "   ${YELLOW}cd server && npm run dev${NC}"
echo ""
echo "   Terminal 2 (Frontend):"
echo "   ${YELLOW}cd client && npm run dev${NC}"
echo ""
echo "   Terminal 3 (MongoDB):"
echo "   ${YELLOW}brew services start mongodb-community${NC}"
echo ""
echo "3. Open browser:"
echo "   ${YELLOW}http://localhost:5173${NC}"
echo ""
echo "For more information, read:"
echo "   - README.md"
echo "   - SETUP_GUIDE.md"
echo "   - COMMANDS.md"
echo ""
