import { useEffect, useState, useMemo } from "react";
import Navbar from "../../components/Layout/Navbar";
import { useTransactions } from "../../context/TransactionContext";
import Button from "../../components/UI/Button";
import Modal from "../../components/UI/Modal";
import Toast from "../../components/UI/Toast";
import TransactionForm from "./TransactionForm";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { CATEGORIES } from "../../utils/constants";
import styles from "./Transactions.module.css";

const TransactionList = () => {
    const { transactions, fetchTransactions, deleteTransaction, loading } = useTransactions();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [toast, setToast] = useState({ isVisible: false, message: "", type: "success" });

    // Filter state
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [sortField, setSortField] = useState("date");
    const [sortOrder, setSortOrder] = useState("desc");

    // Fetch all transactions on mount
    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    // Client-side filtering and sorting
    const filteredAndSortedTransactions = useMemo(() => {
        let filtered = [...transactions];

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(t =>
                t.title.toLowerCase().includes(query) ||
                (t.notes && t.notes.toLowerCase().includes(query))
            );
        }

        // Apply category filter
        if (categoryFilter) {
            filtered = filtered.filter(t => t.category === categoryFilter);
        }

        // Apply date range filter
        if (startDate) {
            filtered = filtered.filter(t => t.date >= startDate);
        }
        if (endDate) {
            filtered = filtered.filter(t => t.date <= endDate);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let aVal = a[sortField];
            let bVal = b[sortField];

            if (sortField === "amount") {
                aVal = parseFloat(aVal);
                bVal = parseFloat(bVal);
            }

            if (sortOrder === "asc") {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        return filtered;
    }, [transactions, searchQuery, categoryFilter, startDate, endDate, sortField, sortOrder]);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("desc");
        }
    };

    const handleClearFilters = () => {
        setSearchQuery("");
        setCategoryFilter("");
        setStartDate("");
        setEndDate("");
    };

    const handleAdd = () => {
        setEditingTransaction(null);
        setIsModalOpen(true);
    };

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this transaction?")) {
            const success = await deleteTransaction(id);
            if (success) {
                setToast({ isVisible: true, message: "Transaction deleted successfully", type: "success" });
                fetchTransactions();
            } else {
                setToast({ isVisible: true, message: "Failed to delete transaction", type: "error" });
            }
        }
    };

    const handleFormSuccess = (message) => {
        setIsModalOpen(false);
        setEditingTransaction(null);
        fetchTransactions();
        setToast({ isVisible: true, message, type: "success" });
    };

    const hasActiveFilters = searchQuery || categoryFilter || startDate || endDate;

    return (
        <div className={styles.transactionsWrapper}>
            <Navbar />
            <div className={styles.transactionsContainer}>
                <div className={styles.header}>
                    <h1>Transactions</h1>
                    <Button onClick={handleAdd}>+ Add Transaction</Button>
                </div>

                {/* Filters */}
                <div className={styles.filters}>
                    <input
                        type="text"
                        placeholder="Search by title or notes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />

                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className={styles.filterSelect}
                    >
                        <option value="">All Categories</option>
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        placeholder="Start Date"
                        className={styles.dateInput}
                    />

                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        placeholder="End Date"
                        className={styles.dateInput}
                    />

                    {hasActiveFilters && (
                        <Button variant="secondary" onClick={handleClearFilters}>
                            Clear Filters
                        </Button>
                    )}
                </div>

                {/* Results Count */}
                <div className={styles.resultsCount}>
                    Showing {filteredAndSortedTransactions.length} of {transactions.length} transactions
                    {hasActiveFilters && " (filtered)"}
                </div>

                {/* Loading State */}
                {loading && <div className={styles.loading}>Loading transactions...</div>}

                {/* Empty State */}
                {!loading && transactions.length === 0 && (
                    <div className={styles.emptyState}>
                        <h2>No transactions yet</h2>
                        <p>Start tracking your expenses by adding your first transaction</p>
                        <Button onClick={handleAdd}>Add Transaction</Button>
                    </div>
                )}

                {/* No Results State */}
                {!loading && transactions.length > 0 && filteredAndSortedTransactions.length === 0 && (
                    <div className={styles.emptyState}>
                        <h2>No matching transactions</h2>
                        <p>Try adjusting your filters</p>
                        <Button variant="secondary" onClick={handleClearFilters}>Clear Filters</Button>
                    </div>
                )}

                {/* Transactions Table */}
                {!loading && filteredAndSortedTransactions.length > 0 && (
                    <div className={styles.tableWrapper}>
                        <table className={styles.transactionsTable}>
                            <thead>
                                <tr>
                                    <th onClick={() => handleSort("date")} className={styles.sortable}>
                                        Date {sortField === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                                    </th>
                                    <th onClick={() => handleSort("title")} className={styles.sortable}>
                                        Title {sortField === "title" && (sortOrder === "asc" ? "↑" : "↓")}
                                    </th>
                                    <th onClick={() => handleSort("category")} className={styles.sortable}>
                                        Category {sortField === "category" && (sortOrder === "asc" ? "↑" : "↓")}
                                    </th>
                                    <th onClick={() => handleSort("amount")} className={styles.sortable}>
                                        Amount {sortField === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
                                    </th>
                                    <th>Notes</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAndSortedTransactions.map((transaction) => (
                                    <tr key={transaction.id}>
                                        <td>{formatDate(transaction.date)}</td>
                                        <td className={styles.titleCol}>{transaction.title}</td>
                                        <td>
                                            <span className={styles.categoryBadge}>
                                                {transaction.category}
                                            </span>
                                        </td>
                                        <td className={styles.amountCol}>{formatCurrency(transaction.amount)}</td>
                                        <td className={styles.notesCol}>{transaction.notes || "-"}</td>
                                        <td className={styles.actionsCol}>
                                            <button
                                                onClick={() => handleEdit(transaction)}
                                                className={styles.editBtn}
                                                title="Edit"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDelete(transaction.id)}
                                                className={styles.deleteBtn}
                                                title="Delete"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Add/Edit Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={editingTransaction ? "Edit Transaction" : "Add Transaction"}
                >
                    <TransactionForm
                        transaction={editingTransaction}
                        onSuccess={handleFormSuccess}
                        onCancel={() => setIsModalOpen(false)}
                    />
                </Modal>

                {/* Toast Notifications */}
                <Toast
                    message={toast.message}
                    type={toast.type}
                    isVisible={toast.isVisible}
                    onClose={() => setToast({ ...toast, isVisible: false })}
                />
            </div>
        </div>
    );
};

export default TransactionList;
