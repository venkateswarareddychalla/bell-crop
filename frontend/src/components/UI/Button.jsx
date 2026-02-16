import styles from "./UI.module.css";

const Button = ({ children, variant = "primary", onClick, type = "button", disabled = false, className = "" }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${styles.btn} ${styles[`btn-${variant}`]} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;
