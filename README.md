# STOCK-TRADING-APP
📈 MERN Stock Trading App

A full-stack Stock Trading Web Application built using the MERN Stack (MongoDB, Express.js, React.js, Node.js). The platform allows users to view live stock data, buy and sell stocks, manage their portfolio, and securely authenticate their accounts.

🚀 Features

👤 User Authentication

User Registration and Login
JWT Authentication
Secure password hashing using bcrypt
Forgot Password with Email Reset Link
📊 Stock Market

Live stock market data using external API
View trending stocks
Search stocks by symbol
💰 Trading System

Buy stocks
Sell stocks
Track portfolio holdings
Store transactions in MongoDB
🔐 Security

JWT protected routes
Password reset system
Secure backend API
🛠 Admin Panel

View all registered users
Monitor trading activity
Block or manage users
🏗 Tech Stack

Frontend

React.js
JavaScript
CSS
Axios
Backend

Node.js
Express.js
Database

MongoDB
Mongoose
Authentication

JSON Web Token (JWT)
bcrypt.js
Email Service

Nodemailer
Stock API

Alpha Vantage API
📂 Project Structure

stock-trading-app │ ├── backend │ ├── models │ ├── routes │ ├── controllers │ ├── middleware │ └── server.js │ ├── frontend │ ├── src │ │ ├── components │ │ ├── pages │ │ └── App.js │ ├── .env ├── package.json └── README.md

⚙️ Installation

1️⃣ Clone the repository

git clone https://github.com/YOUR_USERNAME/stock-trading-app.git

2️⃣ Navigate to project folder

cd stock-trading-app

3️⃣ Install backend dependencies

cd backend npm install

4️⃣ Install frontend dependencies

cd ../frontend npm install

▶️ Running the Application

Start Backend

cd backend npm start

Start Frontend

cd frontend npm run dev

Application will run at:

http://localhost:3000

🔑 Environment Variables

Create a ".env" file in the backend folder and add:

MONGO_URI=your_mongodb_connection_string JWT_SECRET=your_secret_key EMAIL_USER=your_email EMAIL_PASS=your_app_password ALPHA_VANTAGE_API_KEY=your_api_key

📸 Screenshots

Add screenshots of:

Login Page
Dashboard
Stock Market Page
Buy/Sell Interface
Admin Panel
🧠 Future Improvements

Real-time stock charts
Portfolio analytics
Payment gateway integration
Mobile responsive UI
AI-based stock predictions
👨‍💻 Author

Developed by Riya bolke , Shubham More , Pranav Patil , Akansha Kumbhar 

⭐ Support

If you like this project, please ⭐ star the repository on GitHub.
