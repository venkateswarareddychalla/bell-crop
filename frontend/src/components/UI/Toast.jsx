import { useEffect } from "react";
import styles from "./UI.module.css";

const Toast = ({ message, type = "success", isVisible, onClose }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    return (
        <div className={`${styles.toast} ${styles[`toast-${type}`]}`}>
            <span>{message}</span>
            <button className={styles.toastClose} onClick={onClose}>
                ×
            </button>
        </div>
    );
};

export default Toast;
