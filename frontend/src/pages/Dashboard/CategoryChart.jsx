import { formatCurrency } from "../../utils/formatters";
import styles from "./Dashboard.module.css";

const CategoryChart = ({ categories }) => {
    if (!categories || categories.length === 0) {
        return (
            <div className={styles.chartCard}>
                <h2>Category Breakdown</h2>
                <div className={styles.emptyState}>
                    <p>No transactions yet</p>
                </div>
            </div>
        );
    }

    const totalExpenses = categories.reduce((sum, cat) => sum + cat.total, 0);

    return (
        <div className={styles.chartCard}>
            <h2>Category Breakdown</h2>
            <div className={styles.categoryList}>
                {categories.map((category) => {
                    const percentage = ((category.total / totalExpenses) * 100).toFixed(1);
                    return (
                        <div key={category.category} className={styles.categoryItem}>
                            <div className={styles.categoryInfo}>
                                <span className={styles.categoryName}>{category.category}</span>
                                <span className={styles.categoryAmount}>
                                    {formatCurrency(category.total)}
                                </span>
                            </div>
                            <div className={styles.progressBar}>
                                <div
                                    className={styles.progressFill}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                            <div className={styles.categoryStats}>
                                <span>{category.count} transactions</span>
                                <span>{percentage}%</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CategoryChart;
