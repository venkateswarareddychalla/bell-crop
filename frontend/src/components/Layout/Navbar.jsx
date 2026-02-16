import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Layout.module.css";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.navContainer}>
                <Link to="/dashboard" className={styles.logo}>
                    💰 ExpenseTracker
                </Link>

                <div className={styles.navLinks}>
                    <Link to="/dashboard" className={styles.navLink}>
                        Dashboard
                    </Link>
                    <Link to="/transactions" className={styles.navLink}>
                        Transactions
                    </Link>
                </div>

                <div className={styles.navUser}>
                    <span className={styles.userName}>{user?.name}</span>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
