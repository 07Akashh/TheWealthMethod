import * as SQLite from 'expo-sqlite';

export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  note: string;
  receipt?: string;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  streak: number;
  lastUpdated: string;
}

export interface DashboardStats {
  balance: number;
  totalIncome: number;
  totalExpense: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

export interface WeeklyTrend {
  day: string;
  amount: number;
}

export interface ComparisonInfo {
  thisWeekTotal: number;
  lastWeekTotal: number;
  thisMonthTotal: number;
  lastMonthTotal: number;
}

const DATABASE_NAME = 'thewealthmethod.db';

export const sqliteService = {
  getDb: async () => {
    return await SQLite.openDatabaseAsync(DATABASE_NAME);
  },
  init: async (onProgress?: (progress: number) => void) => {
    console.log('[SQLite] Initializing Database...');
    onProgress?.(10);
    const db = await sqliteService.getDb();
    
    onProgress?.(30);
    console.log('[SQLite] Ensuring tables exist...');
    // Transactions Table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY NOT NULL,
        amount REAL NOT NULL,
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL,
        note TEXT,
        receipt TEXT
      );
    `);

    onProgress?.(50);
    // Goals Table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS goals (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT,
        targetAmount REAL NOT NULL,
        currentAmount REAL NOT NULL,
        streak INTEGER DEFAULT 0,
        lastUpdated TEXT
      );
    `);

    onProgress?.(70);
    // Migration for existing tables without 'title'
    try {
      await db.execAsync('ALTER TABLE goals ADD COLUMN title TEXT');
      console.log('[SQLite] Migration: Added title column to goals');
    } catch {
      // Column already exists, swallow error
    }

    onProgress?.(85);
    // Metadata Table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS metadata (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT
      );
    `);

    onProgress?.(95);
    // Seed initial data if empty
    try {
      const txCount = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM transactions');
      if (txCount && txCount.count === 0) {
        console.log('[SQLite] Database is empty, seeding initial data...');
        await sqliteService.seedInitialData();
      } else {
        console.log('[SQLite] Database loaded with', txCount?.count, 'transactions');
      }
    } catch (error) {
      console.error('[SQLite] Error checking/seeding data:', error);
    }
    onProgress?.(100);
  },

  seedInitialData: async () => {
    const db = await sqliteService.getDb();
    const now = new Date();
    
    // Some Income
    const incomeTx = [
      { id: 'i1', amount: 5000, type: 'income', category: 'Salary', date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5).toISOString(), note: 'Monthly pay' },
      { id: 'i2', amount: 450, type: 'income', category: 'Dividend', date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(), note: 'Stock dividends' },
    ];

    // Some Expenses
    const expenseTx = [
      { id: 'e1', amount: 120, type: 'expense', category: 'Food & Drink', date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1).toISOString(), note: 'Dinner' },
      { id: 'e2', amount: 820, type: 'expense', category: 'Travel', date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3).toISOString(), note: 'Flight ticket' },
      { id: 'e3', amount: 210, type: 'expense', category: 'Utilities', date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 4).toISOString(), note: 'Electric bill' },
    ];

    for (const tx of [...incomeTx, ...expenseTx]) {
      await db.runAsync(
        'INSERT INTO transactions (id, amount, type, category, date, note, receipt) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [tx.id, tx.amount, tx.type, tx.category, tx.date, tx.note, null]
      );
    }

    // Initial Goal
    await db.runAsync(
      'INSERT INTO goals (id, title, targetAmount, currentAmount, streak, lastUpdated) VALUES (?, ?, ?, ?, ?, ?)',
      ['savings-goal', 'Emergency Fund', 20000, 15000, 5, now.toISOString()]
    );
  },

  // Transactions CRUD
  insertTransaction: async (tx: Omit<Transaction, 'id'>) => {
    console.log('[SQLite] [Processing] Inserting new transaction...', tx);
    const db = await sqliteService.getDb();
    const id = Math.random().toString(36).substring(7);
    await db.runAsync(
      'INSERT INTO transactions (id, amount, type, category, date, note, receipt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, tx.amount, tx.type, tx.category, tx.date, tx.note || '', tx.receipt || null]
    );
    
    console.log('[SQLite] [Processing] Transaction inserted with ID:', id);
    // Update streaks after each transaction
    await sqliteService.updateStreaks();
    
    return id;
  },

  getTransactions: async (filter?: { type?: string; category?: string }) => {
    const db = await sqliteService.getDb();
    let query = 'SELECT * FROM transactions';
    const params: any[] = [];

    if (filter?.type || filter?.category) {
      query += ' WHERE';
      if (filter.type) {
        query += ' type = ?';
        params.push(filter.type);
      }
      if (filter.category) {
        if (filter.type) query += ' AND';
        query += ' category = ?';
        params.push(filter.category);
      }
    }
    query += ' ORDER BY date DESC';

    return await db.getAllAsync<Transaction>(query, params);
  },

  updateTransaction: async (tx: Transaction) => {
    console.log('[SQLite] [Processing] Updating transaction:', tx.id);
    const db = await sqliteService.getDb();
    await db.runAsync(
      'UPDATE transactions SET amount = ?, type = ?, category = ?, date = ?, note = ?, receipt = ? WHERE id = ?',
      [tx.amount, tx.type, tx.category, tx.date, tx.note, tx.receipt || null, tx.id]
    );
    console.log('[SQLite] [Processing] Transaction updated successfully');
    await sqliteService.updateStreaks();
  },

  deleteTransaction: async (id: string) => {
    const db = await sqliteService.getDb();
    await db.runAsync('DELETE FROM transactions WHERE id = ?', [id]);
    await sqliteService.updateStreaks();
  },

  // Analytics Helpers
  getDashboardStats: async (): Promise<DashboardStats> => {
    const db = await sqliteService.getDb();
    const result = await db.getAllAsync<{ type: string; total: number }>(
      'SELECT type, SUM(amount) as total FROM transactions GROUP BY type'
    );

    let income = 0;
    let expense = 0;

    result.forEach((row) => {
      if (row.type === 'income') income = row.total;
      if (row.type === 'expense') expense = row.total;
    });

    return {
      balance: income - expense,
      totalIncome: income,
      totalExpense: expense,
    };
  },

  getCategoryBreakdown: async (): Promise<CategoryBreakdown[]> => {
    const db = await sqliteService.getDb();
    const expenses = await db.getAllAsync<{ category: string; amount: number }>(
      "SELECT category, SUM(amount) as amount FROM transactions WHERE type = 'expense' AND date >= date('now', 'start of month') GROUP BY category ORDER BY amount DESC"
    );

    const total = expenses.reduce((sum, item) => sum + item.amount, 0);

    return expenses.map((item) => ({
      ...item,
      percentage: total > 0 ? (item.amount / total) * 100 : 0,
    }));
  },

  getWeeklyTrends: async (): Promise<WeeklyTrend[]> => {
    const db = await sqliteService.getDb();
    // Get last 7 unique days of expenses record with data
    const trends = await db.getAllAsync<{ day: string; amount: number; fullDate: string }>(`
      SELECT strftime('%w', date) as day, SUM(amount) as amount, date(date) as fullDate
      FROM transactions 
      WHERE type = 'expense'
      GROUP BY fullDate
      ORDER BY fullDate DESC
      LIMIT 7
    `);

    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    // Reverse to show chronological order
    return trends.reverse().map(t => ({
      day: dayNames[parseInt(t.day)],
      amount: t.amount
    }));
  },
  
  getComparisonInfo: async (): Promise<ComparisonInfo> => {
    const db = await sqliteService.getDb();
    
    // Expenses this week (last 7 days)
    const thisWeek = await db.getFirstAsync<{ total: number }>(
      "SELECT SUM(amount) as total FROM transactions WHERE type = 'expense' AND date >= date('now', '-7 days')"
    );
    
    // Expenses last week (7-14 days ago)
    const lastWeek = await db.getFirstAsync<{ total: number }>(
      "SELECT SUM(amount) as total FROM transactions WHERE type = 'expense' AND date >= date('now', '-14 days') AND date < date('now', '-7 days')"
    );

    // This month
    const thisMonth = await db.getFirstAsync<{ total: number }>(
      "SELECT SUM(amount) as total FROM transactions WHERE type = 'expense' AND date >= date('now', 'start of month')"
    );

    // Last month
    const lastMonth = await db.getFirstAsync<{ total: number }>(
      "SELECT SUM(amount) as total FROM transactions WHERE type = 'expense' AND date >= date('now', 'start of month', '-1 month') AND date < date('now', 'start of month')"
    );

    return {
      thisWeekTotal: thisWeek?.total || 0,
      lastWeekTotal: lastWeek?.total || 0,
      thisMonthTotal: thisMonth?.total || 0,
      lastMonthTotal: lastMonth?.total || 0,
    };
  },

  // Goals & Streaks
  getGoals: async () => {
    const db = await sqliteService.getDb();
    return await db.getAllAsync<Goal>('SELECT * FROM goals');
  },

  upsertGoal: async (goal: Omit<Goal, 'id' | 'streak' | 'lastUpdated'> & { id?: string }) => {
    const db = await sqliteService.getDb();
    if (goal.id) {
      await db.runAsync(
        'UPDATE goals SET title = ?, targetAmount = ?, currentAmount = ? WHERE id = ?',
        [goal.title || 'Wealth Goal', goal.targetAmount, goal.currentAmount, goal.id]
      );
    } else {
      const id = Math.random().toString(36).substring(7);
      await db.runAsync(
        'INSERT INTO goals (id, title, targetAmount, currentAmount, streak, lastUpdated) VALUES (?, ?, ?, ?, ?, ?)',
        [id, goal.title || 'Wealth Goal', goal.targetAmount, goal.currentAmount, 0, new Date().toISOString()]
      );
    }
  },

  deleteGoal: async (id: string) => {
    const db = await sqliteService.getDb();
    await db.runAsync('DELETE FROM goals WHERE id = ?', [id]);
  },

  updateStreaks: async () => {
    const db = await sqliteService.getDb();
    const threshold = 100; // Default threshold of $100 daily expense for streak reset
    
    const today = new Date().toISOString().split('T')[0];
    const dailyExpenses = await db.getFirstAsync<{ total: number }>(
      'SELECT SUM(amount) as total FROM transactions WHERE type = "expense" AND date LIKE ?',
      [`${today}%`]
    );

    const goal = await db.getFirstAsync<Goal>('SELECT * FROM goals LIMIT 1');
    if (!goal) return;

    const lastDate = goal.lastUpdated?.split('T')[0];
    
    if (lastDate === today) return; // Already updated today

    let newStreak = goal.streak;
    if ((dailyExpenses?.total || 0) < threshold) {
      newStreak += 1;
    } else {
      newStreak = 0;
    }

    await db.runAsync(
      'UPDATE goals SET streak = ?, lastUpdated = ? WHERE id = ?',
      [newStreak, new Date().toISOString(), goal.id]
    );
  }
};
