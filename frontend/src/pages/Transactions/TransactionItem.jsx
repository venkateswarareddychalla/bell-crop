import { useState } from "react";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { useTransactions } from "../../Context/TransactionContext";
import Button from "../../components/UI/Button";
import styles from "./Transactions.module.css";

const TransactionItem = ({ transaction, onEdit, onDeleteSuccess }) => {
    const { deleteTransaction } = useTransactions();
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);
        const result = await deleteTransaction(transaction.id);
        setDeleting(false);

        if (result.success) {
            onDeleteSuccess();
        } else {
            alert(result.error);
        }
    };

    return (
        <div className={styles.transactionCard}>
            <div className={styles.transactionHeader}>
                <h3>{transaction.title}</h3>
                <span className={styles.categoryBadge}>{transaction.category}</span>
            </div>

            <div className={styles.transactionBody}>
                <div className={styles.transactionAmount}>
                    {formatCurrency(transaction.amount)}
                </div>
                <div className={styles.transactionDate}>{formatDate(transaction.date)}</div>
                {transaction.notes && (
                    <p className={styles.transactionNotes}>{transaction.notes}</p>
                )}
            </div>

            {showConfirm ? (
                <div className={styles.confirmDelete}>
                    <p>Are you sure you want to delete this transaction?</p>
                    <div className={styles.confirmActions}>
                        <Button
                            variant="secondary"
                            onClick={() => setShowConfirm(false)}
                            disabled={deleting}
                        >
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDelete} disabled={deleting}>
                            {deleting ? "Deleting..." : "Delete"}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className={styles.transactionActions}>
                    <Button variant="secondary" onClick={() => onEdit(transaction)}>
                        Edit
                    </Button>
                    <Button variant="danger" onClick={() => setShowConfirm(true)}>
                        Delete
                    </Button>
                </div>
            )}
        </div>
    );
};

export default TransactionItem;
