# 💰 Personal Expense Tracker

A modern, full-stack expense tracking application built with React and Node.js. Track your expenses, visualize spending patterns, and manage your finances with a beautiful, intuitive interface.

![Expense Tracker](https://img.shields.io/badge/React-18.2.0-blue) ![Node.js](https://img.shields.io/badge/Node.js-20+-green) ![SQLite](https://img.shields.io/badge/SQLite-3.0-lightblue)

## ✨ Features

### 🎯 Core Functionality
- **Transaction Management** - Add, edit, delete, and view all transactions in a clean table layout
- **Real-time Filtering** - Search by title/notes, filter by category, date range, and amount
- **Sortable Columns** - Click any column header to sort transactions
- **Dashboard Analytics** - View spending summaries, category breakdowns, and recent transactions
- **User Authentication** - Secure login and registration with JWT tokens

### 🎨 Modern UI/UX
- **Emerald/Teal Color Scheme** - Fresh, modern design with vibrant emerald green accents
- **Glassmorphism Effects** - Blurred backgrounds and semi-transparent elements
- **Poppins Font** - Clean, professional typography
- **Smooth Animations** - Glow effects, transitions, and micro-interactions
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### 🚀 Technical Features
- **Client-side Filtering** - Instant search and filter without API calls
- **RESTful API** - Clean, organized backend endpoints
- **SQLite Database** - Lightweight, file-based database
- **Context API** - Global state management
- **CSS Modules** - Scoped, modular styling
- **Toast Notifications** - User feedback for actions

## 🏗️ Tech Stack

### Frontend
- **React 18.2** - Modern React with hooks
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS Modules** - Component-scoped styling
- **Vite** - Fast development and build tool

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **better-sqlite3** - SQLite database driver
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📦 Installation

### Prerequisites
- Node.js 20 or higher
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bell-crop
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up Environment Variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=3000
   JWT_SECRET=your_super_secret_jwt_key_here
   ```

5. **Initialize Database**
   
   The database will be automatically created on first run. The backend uses SQLite with the following schema:
   - `users` - User accounts
   - `transactions` - Income/expense records

## 🚀 Running the Application

### Development Mode

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run server
   ```
   Backend runs on: `http://localhost:3000`

2. **Start the Frontend Dev Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on: `http://localhost:5173`

3. **Access the Application**
   
   Open your browser and navigate to `http://localhost:5173`

### Production Build

**Build Frontend**
```bash
cd frontend
npm run build
```

The production-ready files will be in `frontend/dist`

## 📱 Application Structure

```
bell-crop/
├── backend/
│   ├── server.js           # Express server and API routes
│   ├── database.db         # SQLite database (auto-generated)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── Layout/     # Navbar, layout components
│   │   │   └── UI/         # Button, Modal, Toast, Input
│   │   ├── context/        # React Context for state management
│   │   ├── pages/          # Page components
│   │   │   ├── Auth/       # Login/Register
│   │   │   ├── Dashboard/  # Analytics dashboard
│   │   │   └── Transactions/ # Transaction management
│   │   ├── utils/          # Helper functions, constants
│   │   ├── App.jsx         # Main app component
│   │   ├── index.css       # Global styles
│   │   └── main.jsx        # Entry point
│   ├── index.html
│   └── package.json
└── README.md
```

## 🎯 Key Features Explained

### Transaction Management
- **Table View** - Clean, scannable table with all transaction details
- **CRUD Operations** - Full create, read, update, delete functionality
- **Category System** - Pre-defined categories (Food, Transport, Shopping, etc.)
- **Notes Field** - Add additional context to transactions

### Filtering & Search
- **Real-time Search** - Filter by title or notes as you type
- **Category Filter** - Dropdown to filter by specific category
- **Date Range** - Start and end date filters
- **Combined Filters** - All filters work together with AND logic
- **Result Counter** - Shows "X of Y transactions (filtered)"

### Dashboard
- **Spending Summary** - Total income, expenses, and balance
- **Category Breakdown** - Visual breakdown by category
- **Recent Transactions** - Quick view of latest entries

## 🎨 Design System

### Color Palette
- **Primary**: `#10b981` (Emerald Green)
- **Secondary**: `#14b8a6` (Teal)
- **Background**: Dark slate (#0f172a, #1e293b)
- **Text**: Light slate (#f1f5f9, #cbd5e1)

### Typography
- **Font Family**: Poppins (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Components
- **Buttons** - Gradient backgrounds with glow effects
- **Inputs** - Semi-transparent with emerald focus states
- **Modal** - Glassmorphism with backdrop blur
- **Table** - Hover effects and sortable columns

## 🔐 Authentication

- **Registration** - Create new user account with name, email, password
- **Login** - Authenticate with email and password
- **JWT Tokens** - Secure authentication with JSON Web Tokens
- **Protected Routes** - Dashboard and transactions require authentication

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Transactions
- `GET /api/transactions` - Get all user transactions (with pagination)
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/search` - Search/filter transactions

### Dashboard
- `GET /api/dashboard` - Get dashboard analytics

## 🐛 Troubleshooting

### Port Already in Use
If port 3000 or 5173 is already in use:
- **Backend**: Change `PORT` in `.env` file
- **Frontend**: Vite will automatically suggest an alternative port

### Database Locked
If you get a "database is locked" error:
- Close any other connections to the database
- Restart the backend server

### Dependencies Not Installing
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## 🔮 Future Enhancements

- [ ] Budget setting and tracking
- [ ] Recurring transactions
- [ ] Export data to CSV/PDF
- [ ] Data visualization charts
- [ ] Multi-currency support
- [ ] Mobile app (React Native)
- [ ] Receipt photo upload

## 👨‍💻 Development

### Code Style
- Use ES6+ features
- Functional components with hooks
- CSS Modules for styling
- Consistent naming conventions

### Best Practices
- Keep components small and focused
- Use context for global state
- Validate all user inputs
- Handle errors gracefully
- Write descriptive commit messages

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with React and Node.js
- Icons and design inspiration from modern UI trends
- Poppins font from Google Fonts

---

**Made with ❤️ for better financial tracking**
