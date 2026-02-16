import { useState, useEffect } from "react";
import { useTransactions } from "../../Context/TransactionContext";
import { CATEGORIES } from "../../utils/constants";
import { formatDateForInput } from "../../utils/formatters";
import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";
import styles from "./TransactionForm.module.css";

const TransactionForm = ({ transaction, onSuccess, onCancel }) => {
    const { createTransaction, updateTransaction } = useTransactions();
    const [formData, setFormData] = useState({
        title: "",
        amount: "",
        category: "Food",
        date: formatDateForInput(),
        notes: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (transaction) {
            setFormData({
                title: transaction.title,
                amount: transaction.amount,
                category: transaction.category,
                date: transaction.date,
                notes: transaction.notes || "",
            });
        }
    }, [transaction]);

    const validate = () => {
        const newErrors = {};
        if (!formData.title) newErrors.title = "Title is required";
        if (!formData.amount || formData.amount <= 0)
            newErrors.amount = "Amount must be greater than 0";
        if (!formData.category) newErrors.category = "Category is required";
        if (!formData.date) newErrors.date = "Date is required";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        const result = transaction
            ? await updateTransaction(transaction.id, formData)
            : await createTransaction(formData);

        setLoading(false);

        if (result.success) {
            onSuccess(
                transaction
                    ? "Transaction updated successfully"
                    : "Transaction added successfully"
            );
        } else {
            setErrors({ general: result.error });
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            {errors.general && (
                <div className={styles.errorMessage}>{errors.general}</div>
            )}

            <div className={styles.formGroup}>
                <label className={styles.label}>
                    Title <span className={styles.required}>*</span>
                </label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Grocery Shopping"
                    className={`${styles.input} ${errors.title ? styles.error : ""}`}
                />
                {errors.title && <div className={styles.errorMessage}>{errors.title}</div>}
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>
                    Amount <span className={styles.required}>*</span>
                </label>
                <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                    className={`${styles.input} ${errors.amount ? styles.error : ""}`}
                />
                {errors.amount && <div className={styles.errorMessage}>{errors.amount}</div>}
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>
                    Category <span className={styles.required}>*</span>
                </label>
                <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={styles.select}
                >
                    {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>
                    Date <span className={styles.required}>*</span>
                </label>
                <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={`${styles.input} ${errors.date ? styles.error : ""}`}
                />
                {errors.date && <div className={styles.errorMessage}>{errors.date}</div>}
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Notes</label>
                <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Add any additional notes..."
                    className={styles.textarea}
                    rows="4"
                />
            </div>

            <div className={styles.formActions}>
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : transaction ? "Update" : "Add"}
                </Button>
            </div>
        </form>
    );
};

export default TransactionForm;
