import { formatCurrency, formatNumber } from "../../utils/formatters";
import styles from "./Dashboard.module.css";

const SummaryCard = ({ title, value, type, icon }) => {
    const formatValue = () => {
        if (type === "currency") {
            return formatCurrency(value);
        } else if (type === "number") {
            return formatNumber(value, 0);
        } else {
            return value;
        }
    };

    return (
        <div className={styles.summaryCard}>
            <div className={styles.cardIcon}>{icon}</div>
            <div className={styles.cardContent}>
                <h3>{title}</h3>
                <p className={styles.cardValue}>{formatValue()}</p>
            </div>
        </div>
    );
};

export default SummaryCard;
