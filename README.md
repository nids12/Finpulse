# 📊 FinPulse

FinPulse is a modern full-stack stock dashboard web application for tracking, buying, and selling stocks—including Indian stocks—using real-time data. It features secure user authentication, portfolio management with charts, a modal-based Groww-style buy/sell flow, and a personal notes section. The app provides a clean, responsive UI with dark mode support.

## 🚀 Features

- 🔐 **User Authentication** – Secure signup and login with JWT.
- 📈 **Real-Time Stock Data** – Live prices for Indian and global stocks via Twelve Data API and Finnhub API.
- 💰 **Buy/Sell Stocks** – Modal-based buy/sell flow inspired by Groww.
- 📊 **Portfolio Management** – Track holdings, transaction history, and portfolio value with dynamic charts.
- 📝 **Notes Section** – Add and manage personal notes for each user (built with React).
- 🌙 **Dark Mode** – Toggle between light and dark themes.
- 📱 **Responsive UI** – Clean, modern, and mobile-friendly interface.

## 🛠 Tech Stack

**Frontend:**

- HTML, CSS, JavaScript
- React (for Notes section)
- Chart.js

**Backend:**

- Node.js
- Express.js
- MongoDB & Mongoose
- JWT (JSON Web Tokens)
- bcrypt (for password hashing)

**APIs:**

- Twelve Data API – For real-time stock prices (`TWELVE_DATA_API_KEY`)
- Finnhub API – For financial news, quotes, and additional market data (`STOCK_API_KEY`)

## ⚙️ Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB (local or hosted via MongoDB Atlas)
- Twelve Data API key
- Finnhub API key

### 🔧 Setup Instructions

1. **Clone the Repository:**
   ```sh
   git clone https://github.com/nids12/Finpulse.git
   cd Finpulse
   ```
2. **Backend Setup:**
   ```sh
   cd backend
   npm install
   ```
   Create a `.env` file in the backend folder with the following:
   ```env
   MONGO_URI=your_mongodb_connection_string
   STOCK_API_KEY=your_finnhub_api_key
   TWELVE_DATA_API_KEY=your_twelve_data_api_key
   JWT_SECRET=your_jwt_secret
   ```
   Start the backend server:
   ```sh
   npm start
   ```
3. **Frontend Setup:**
   - Open `frontend/index.html` directly in a browser, or
   - Deploy as a static site using Netlify, GitHub Pages, etc.
   - If using the React Notes section, run it as a separate app or compile into your UI.

## 🧑‍💻 Usage

- Sign up or log in to your account
- Search for stocks by symbol (e.g., TCS, INFY, RELIANCE)
- Buy or sell stocks using the modal interface
- View your portfolio, transaction history, and value charts
- Real-time data fetched from Twelve Data and Finnhub
- Add personal notes via the Notes section
- Use dark mode toggle as needed

## 📁 Project Structure

```
FinPulse/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── .env
│   └── server.js
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   └── components/
│       └── NotesPage.jsx
├── README.md
```

## 📄 License

This project is licensed under the MIT License. You are free to use, modify, and distribute it for personal and commercial use.

---

FinPulse – Your personal stock dashboard
