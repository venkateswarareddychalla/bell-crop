import { formatCurrency, formatDate } from "../../utils/formatters";
import Button from "../../components/UI/Button";
import styles from "./Explorer.module.css";

const TransactionGrid = ({ transactions, pagination, loading, onLoadMore }) => {
    if (loading && (!transactions || transactions.length === 0)) {
        return <div className={styles.loading}>Searching...</div>;
    }

    if (!transactions || transactions.length === 0) {
        return (
            <div className={styles.emptyState}>
                <h2>No transactions found</h2>
                <p>Try adjusting your search or filters</p>
            </div>
        );
    }

    const hasMore = pagination && pagination.page < pagination.totalPages;

    return (
        <div className={styles.gridContainer}>
            <div className={styles.resultsInfo}>
                <span>
                    {pagination ? `Showing ${transactions.length} of ${pagination.total} transactions` : `${transactions.length} transactions`}
                </span>
            </div>

            <div className={styles.transactionGrid}>
                {transactions.map((transaction) => (
                    <div key={transaction.id} className={styles.gridCard}>
                        <div className={styles.cardHeader}>
                            <h3>{transaction.title}</h3>
                            <span className={styles.categoryBadge}>{transaction.category}</span>
                        </div>
                        <div className={styles.cardBody}>
                            <div className={styles.cardAmount}>
                                {formatCurrency(transaction.amount)}
                            </div>
                            <div className={styles.cardDate}>{formatDate(transaction.date)}</div>
                            {transaction.notes && (
                                <p className={styles.cardNotes}>{transaction.notes}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {hasMore && (
                <div className={styles.loadMore}>
                    <Button onClick={onLoadMore} disabled={loading}>
                        {loading ? "Loading..." : "Load More"}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default TransactionGrid;
