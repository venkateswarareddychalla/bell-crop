import { createContext, useState, useContext, useCallback } from "react";
import api from "../utils/api";

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState({
        summary: null,
        categories: [],
        recent: [],
    });

    // Fetch all transactions
    const fetchTransactions = useCallback(async (page = 1, limit = 50) => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await api.get(`/api/transactions?page=${page}&limit=${limit}`);
            setTransactions(data.transactions);
            setLoading(false);
            return data;
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.error || "Failed to fetch transactions");
            return null;
        }
    }, []);

    // Create transaction
    const createTransaction = async (transactionData) => {
        try {
            setError(null);
            const { data } = await api.post("/api/transactions", transactionData);
            setTransactions((prev) => [data, ...prev]);
            return { success: true, data };
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to create transaction";
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    // Update transaction
    const updateTransaction = async (id, transactionData) => {
        try {
            setError(null);
            const { data } = await api.put(`/api/transactions/${id}`, transactionData);
            setTransactions((prev) =>
                prev.map((t) => (t.id === id ? data : t))
            );
            return { success: true, data };
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to update transaction";
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    // Delete transaction
    const deleteTransaction = async (id) => {
        try {
            setError(null);
            await api.delete(`/api/transactions/${id}`);
            setTransactions((prev) => prev.filter((t) => t.id !== id));
            return { success: true };
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to delete transaction";
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    // Fetch dashboard data
    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const [summaryRes, categoriesRes, recentRes] = await Promise.all([
                api.get("/api/dashboard/summary"),
                api.get("/api/dashboard/categories"),
                api.get("/api/dashboard/recent"),
            ]);

            setDashboardData({
                summary: summaryRes.data,
                categories: categoriesRes.data,
                recent: recentRes.data,
            });
            setLoading(false);
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.error || "Failed to fetch dashboard data");
        }
    }, []);

    // Search transactions
    const searchTransactions = useCallback(async (params) => {
        try {
            setLoading(true);
            setError(null);
            const queryString = new URLSearchParams(params).toString();
            console.log("Searching with params:", params);
            console.log("Query string:", queryString);
            const { data } = await api.get(`/api/transactions/search?${queryString}`);
            console.log("Search results:", data);
            setLoading(false);
            return data;
        } catch (err) {
            console.error("Search error:", err);
            setLoading(false);
            setError(err.response?.data?.error || "Failed to search transactions");
            return null;
        }
    }, []);

    const value = {
        transactions,
        loading,
        error,
        dashboardData,
        fetchTransactions,
        createTransaction,
        updateTransaction,
        deleteTransaction,
        fetchDashboardData,
        searchTransactions,
    };

    return (
        <TransactionContext.Provider value={value}>
            {children}
        </TransactionContext.Provider>
    );
};

export const useTransactions = () => {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error("useTransactions must be used within TransactionProvider");
    }
    return context;
};
