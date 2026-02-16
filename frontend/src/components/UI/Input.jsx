import styles from "./UI.module.css";

const Input = ({ label, type = "text", value, onChange, placeholder, error, required = false, ...props }) => {
    return (
        <div className={styles.inputGroup}>
            {label && (
                <label className={styles.label}>
                    {label} {required && <span className={styles.required}>*</span>}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`${styles.input} ${error ? styles.inputError : ""}`}
                {...props}
            />
            {error && <span className={styles.errorText}>{error}</span>}
        </div>
    );
};

export default Input;
