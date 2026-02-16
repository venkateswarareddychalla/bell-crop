import { useNavigate } from "react-router-dom";
import { formatCurrency, formatDate } from "../../utils/formatters";
import Button from "../../components/UI/Button";
import styles from "./Dashboard.module.css";

const RecentTransactions = ({ transactions }) => {
    const navigate = useNavigate();

    if (!transactions || transactions.length === 0) {
        return (
            <div className={styles.chartCard}>
                <h2>Recent Transactions</h2>
                <div className={styles.emptyState}>
                    <p>No transactions yet</p>
                    <Button onClick={() => navigate("/transactions")}>
                        Add Your First Transaction
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.chartCard}>
            <div className={styles.recentHeader}>
                <h2>Recent Transactions</h2>
                <Button variant="secondary" onClick={() => navigate("/transactions")}>
                    View All
                </Button>
            </div>
            <div className={styles.transactionList}>
                {transactions.map((transaction) => (
                    <div key={transaction.id} className={styles.transactionItem}>
                        <div className={styles.transactionInfo}>
                            <h4>{transaction.title}</h4>
                            <span className={styles.transactionMeta}>
                                {transaction.category} • {formatDate(transaction.date)}
                            </span>
                        </div>
                        <div className={styles.transactionAmount}>
                            {formatCurrency(transaction.amount)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentTransactions;
