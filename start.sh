#!/bin/bash

# SDA Evaluation App - Startup Script

echo "==================================="
echo "SDA Evaluation App - Startup"
echo "==================================="

# Check if database needs seeding
if [ ! -f "backend/sda.db" ]; then
    echo "Initializing database..."
    cd backend
    python scripts/seed_database.py
    cd ..
fi

# Start backend (in background)
echo "Starting backend server on port 8000..."
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

# Wait for backend to be ready
sleep 2

# Start frontend
echo "Starting frontend server on port 3000..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "==================================="
echo "Application started!"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo "==================================="
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for interrupt
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
wait
