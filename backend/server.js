import express from "express";
import Database from "better-sqlite3";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Setup app
const app = express();
app.use(express.json());
app.use(cors());

// Setup database
const dbPath = join(__dirname, "database.db");
const db = new Database(dbPath);

// Create tables
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`).run();

// JWT Secret
const JWT_SECRET = "your-secret-key-change-in-production";

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid token" });
  }
};

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Bellcorp Expense Tracker API is running!" });
});

// ==================== AUTH ENDPOINTS ====================

// Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user exists
    const existingUser = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email);

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const result = db
      .prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)")
      .run(name, email, hashedPassword);

    // Create token
    const token = jwt.sign({ id: result.lastInsertRowid }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      token,
      user: {
        id: result.lastInsertRowid,
        name,
        email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if user exists
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Create token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get current user
app.get("/api/auth/me", authenticateToken, (req, res) => {
  try {
    const user = db
      .prepare("SELECT id, name, email FROM users WHERE id = ?")
      .get(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ==================== TRANSACTION CRUD ====================

// Get all transactions for user with pagination
app.get("/api/transactions", authenticateToken, (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    const transactions = db
      .prepare(
        `SELECT * FROM transactions 
         WHERE user_id = ? 
         ORDER BY date DESC, created_at DESC 
         LIMIT ? OFFSET ?`
      )
      .all(req.user.id, limit, offset);

    const total = db
      .prepare("SELECT COUNT(*) as count FROM transactions WHERE user_id = ?")
      .get(req.user.id).count;

    res.json({
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get transactions error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get single transaction
app.get("/api/transactions/:id", authenticateToken, (req, res) => {
  try {
    const transaction = db
      .prepare("SELECT * FROM transactions WHERE id = ? AND user_id = ?")
      .get(req.params.id, req.user.id);

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.json(transaction);
  } catch (error) {
    console.error("Get transaction error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Create transaction
app.post("/api/transactions", authenticateToken, (req, res) => {
  try {
    const { title, amount, category, date, notes } = req.body;

    // Validation
    if (!title || !amount || !category || !date) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    const result = db
      .prepare(
        `INSERT INTO transactions (user_id, title, amount, category, date, notes) 
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(req.user.id, title, amount, category, date, notes || null);

    const transaction = db
      .prepare("SELECT * FROM transactions WHERE id = ?")
      .get(result.lastInsertRowid);

    res.status(201).json(transaction);
  } catch (error) {
    console.error("Create transaction error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update transaction
app.put("/api/transactions/:id", authenticateToken, (req, res) => {
  try {
    const { title, amount, category, date, notes } = req.body;

    // Check if transaction exists and belongs to user
    const existing = db
      .prepare("SELECT * FROM transactions WHERE id = ? AND user_id = ?")
      .get(req.params.id, req.user.id);

    if (!existing) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    db.prepare(
      `UPDATE transactions 
       SET title = ?, amount = ?, category = ?, date = ?, notes = ?
       WHERE id = ?`
    ).run(title, amount, category, date, notes || null, req.params.id);

    const updated = db
      .prepare("SELECT * FROM transactions WHERE id = ?")
      .get(req.params.id);

    res.json(updated);
  } catch (error) {
    console.error("Update transaction error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete transaction
app.delete("/api/transactions/:id", authenticateToken, (req, res) => {
  try {
    // Check if transaction exists and belongs to user
    const existing = db
      .prepare("SELECT * FROM transactions WHERE id = ? AND user_id = ?")
      .get(req.params.id, req.user.id);

    if (!existing) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    db.prepare("DELETE FROM transactions WHERE id = ?").run(req.params.id);

    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Delete transaction error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ==================== DASHBOARD ENDPOINTS ====================

// Get summary
app.get("/api/dashboard/summary", authenticateToken, (req, res) => {
  try {
    const summary = db
      .prepare(
        `SELECT 
          COUNT(*) as totalTransactions,
          COALESCE(SUM(amount), 0) as totalExpenses,
          COALESCE(AVG(amount), 0) as averageTransaction
         FROM transactions 
         WHERE user_id = ?`
      )
      .get(req.user.id);

    // Get current month expenses
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const monthlyExpenses = db
      .prepare(
        `SELECT COALESCE(SUM(amount), 0) as amount 
         FROM transactions 
         WHERE user_id = ? AND date LIKE ?`
      )
      .get(req.user.id, `${currentMonth}%`).amount;

    res.json({
      totalTransactions: summary.totalTransactions,
      totalExpenses: summary.totalExpenses,
      averageTransaction: summary.averageTransaction,
      currentMonthExpenses: monthlyExpenses,
    });
  } catch (error) {
    console.error("Get summary error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get category breakdown
app.get("/api/dashboard/categories", authenticateToken, (req, res) => {
  try {
    const categories = db
      .prepare(
        `SELECT 
          category,
          COUNT(*) as count,
          SUM(amount) as total
         FROM transactions 
         WHERE user_id = ?
         GROUP BY category
         ORDER BY total DESC`
      )
      .all(req.user.id);

    res.json(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get recent transactions
app.get("/api/dashboard/recent", authenticateToken, (req, res) => {
  try {
    const recent = db
      .prepare(
        `SELECT * FROM transactions 
         WHERE user_id = ? 
         ORDER BY date DESC, created_at DESC 
         LIMIT 5`
      )
      .all(req.user.id);

    res.json(recent);
  } catch (error) {
    console.error("Get recent error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ==================== SEARCH & FILTER ====================

// Search and filter transactions
app.get("/api/transactions/search", authenticateToken, (req, res) => {
  try {
    const {
      q,
      category,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      page = 1,
      limit = 20,
    } = req.query;

    let query = "SELECT * FROM transactions WHERE user_id = ?";
    const params = [req.user.id];

    // Search by title or notes
    if (q) {
      query += " AND (title LIKE ? OR notes LIKE ?)";
      params.push(`%${q}%`, `%${q}%`);
    }

    // Filter by category
    if (category) {
      query += " AND category = ?";
      params.push(category);
    }

    // Filter by date range
    if (startDate) {
      query += " AND date >= ?";
      params.push(startDate);
    }
    if (endDate) {
      query += " AND date <= ?";
      params.push(endDate);
    }

    // Filter by amount range
    if (minAmount) {
      query += " AND amount >= ?";
      params.push(parseFloat(minAmount));
    }
    if (maxAmount) {
      query += " AND amount <= ?";
      params.push(parseFloat(maxAmount));
    }

    // Order by date
    query += " ORDER BY date DESC, created_at DESC";

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += " LIMIT ? OFFSET ?";
    params.push(parseInt(limit), offset);

    const transactions = db.prepare(query).all(...params);

    // Get total count for pagination
    let countQuery = "SELECT COUNT(*) as count FROM transactions WHERE user_id = ?";
    const countParams = [req.user.id];
    
    if (q) {
      countQuery += " AND (title LIKE ? OR notes LIKE ?)";
      countParams.push(`%${q}%`, `%${q}%`);
    }
    if (category) {
      countQuery += " AND category = ?";
      countParams.push(category);
    }
    if (startDate) {
      countQuery += " AND date >= ?";
      countParams.push(startDate);
    }
    if (endDate) {
      countQuery += " AND date <= ?";
      countParams.push(endDate);
    }
    if (minAmount) {
      countQuery += " AND amount >= ?";
      countParams.push(parseFloat(minAmount));
    }
    if (maxAmount) {
      countQuery += " AND amount <= ?";
      countParams.push(parseFloat(maxAmount));
    }

    const total = db.prepare(countQuery).get(...countParams).count;

    res.json({
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/`);
  console.log(`📊 Database: ${dbPath}`);
});
