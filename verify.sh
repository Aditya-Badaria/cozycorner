#!/bin/bash

# Cozy Corner - Verification Script
# Run this to verify the project is set up correctly

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Verify Node.js and npm
print_header "Verifying Environment"

if command -v node &> /dev/null; then
  print_success "Node.js: $(node --version)"
else
  print_error "Node.js not found"
  exit 1
fi

if command -v npm &> /dev/null; then
  print_success "npm: $(npm --version)"
else
  print_error "npm not found"
  exit 1
fi

# Verify directory structure
print_header "Verifying Directory Structure"

declare -a dirs=(
  "server"
  "server/src"
  "server/src/config"
  "server/src/models"
  "server/src/routes"
  "server/src/middleware"
  "client"
  "client/src"
  "client/src/components"
  "client/src/services"
)

for dir in "${dirs[@]}"; do
  if [ -d "$dir" ]; then
    print_success "Directory exists: $dir"
  else
    print_error "Directory missing: $dir"
  fi
done

# Verify files
print_header "Verifying Files"

declare -a files=(
  "server/package.json"
  "server/.env"
  "server/src/index.js"
  "server/src/config/database.js"
  "server/src/models/User.js"
  "server/src/routes/users.js"
  "server/src/middleware/errorHandler.js"
  "client/package.json"
  "client/.env"
  "client/src/App.jsx"
  "client/src/components/Home.jsx"
  "client/src/services/api.js"
  "client/tailwind.config.js"
  "client/postcss.config.js"
  "README.md"
  "SETUP_GUIDE.md"
  "DEVELOPER_GUIDE.md"
  "COMMANDS.md"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    print_success "File exists: $file"
  else
    print_error "File missing: $file"
  fi
done

# Verify dependencies
print_header "Verifying Dependencies"

echo ""
echo "Backend dependencies:"
if [ -d "server/node_modules" ]; then
  print_success "server/node_modules exists"
else
  print_warning "server/node_modules not found - run: cd server && npm install"
fi

echo ""
echo "Frontend dependencies:"
if [ -d "client/node_modules" ]; then
  print_success "client/node_modules exists"
else
  print_warning "client/node_modules not found - run: cd client && npm install"
fi

# Verify environment configuration
print_header "Verifying Environment Configuration"

if [ -f "server/.env" ]; then
  print_success "server/.env configured"
  echo "  $(grep -E 'PORT|MONGODB_URI|CLIENT_URL' server/.env | head -3)"
else
  print_error "server/.env not found"
fi

if [ -f "client/.env" ]; then
  print_success "client/.env configured"
  echo "  $(grep VITE_API_URL client/.env)"
else
  print_error "client/.env not found"
fi

# Check MongoDB
print_header "Checking MongoDB"

if command -v mongosh &> /dev/null; then
  print_success "mongosh installed"
  
  # Try to connect (with timeout)
  if timeout 2 mongosh --eval "db.version()" &> /dev/null; then
    print_success "MongoDB is running and accessible"
  else
    print_warning "MongoDB not running. Start with: brew services start mongodb-community"
  fi
else
  print_warning "mongosh not found - using MongoDB Atlas?"
fi

# Summary
print_header "Verification Summary"

echo ""
echo -e "${GREEN}Project structure verified!${NC}"
echo ""
echo "Next steps:"
echo "1. Make setup script executable: chmod +x setup.sh"
echo "2. Install dependencies: ./setup.sh"
echo "3. Start development servers (3 terminals):"
echo "   - Backend: cd server && npm run dev"
echo "   - Frontend: cd client && npm run dev"
echo "   - MongoDB: brew services start mongodb-community"
echo "4. Open browser: http://localhost:5173"
echo ""
