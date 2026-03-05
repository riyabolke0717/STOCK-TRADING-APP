# Fix Plan: Connect Frontend to Backend for User Registration and Stock Details

## Issues Identified:
1. Register.jsx - Uses localStorage instead of backend API
2. Login.jsx - Uses localStorage instead of backend API
3. StockDetail.jsx - Hardcoded balance value

## Tasks:
- [x] 1. Update Register.jsx to connect to backend API (/api/auth/register)
- [x] 2. Update Login.jsx to connect to backend API (/api/auth/login)
- [x] 3. Update StockDetail.jsx to show actual user balance from MongoDB

## Summary of Changes:
1. **Register.jsx**: Now sends user data to MongoDB via POST /api/auth/register
2. **Login.jsx**: Now authenticates against MongoDB via POST /api/auth/login
3. **StockDetail.jsx**: Now displays actual user balance from MongoDB

## How to Test:
1. Make sure MongoDB is running
2. Start backend server: `cd backend && npm start`
3. Start frontend: `cd frontend && npm start`
4. Register a new user - data will be saved to MongoDB
5. Login with registered user - balance will be shown from MongoDB
6. View Stock Detail page - balance will be displayed from MongoDB

