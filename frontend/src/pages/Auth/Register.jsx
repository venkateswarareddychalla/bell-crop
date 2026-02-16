import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";
import styles from "./Auth.module.css";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { register, loading } = useAuth();
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};
        if (!name) newErrors.name = "Name is required";
        if (!email) newErrors.email = "Email is required";
        if (!password) newErrors.password = "Password is required";
        if (password.length < 6)
            newErrors.password = "Password must be at least 6 characters";
        if (password !== confirmPassword)
            newErrors.confirmPassword = "Passwords do not match";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const result = await register(name, email, password);
        if (result.success) {
            navigate("/dashboard");
        } else {
            setErrors({ general: result.error });
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <div className={styles.authHeader}>
                    <h1>💰 ExpenseTracker</h1>
                    <h2>Create Account</h2>
                    <p>Start tracking your expenses today</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.authForm}>
                    {errors.general && (
                        <div className={styles.errorAlert}>{errors.general}</div>
                    )}

                    <Input
                        label="Name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        error={errors.name}
                        required
                    />

                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        error={errors.email}
                        required
                    />

                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a password"
                        error={errors.password}
                        required
                    />

                    <Input
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        error={errors.confirmPassword}
                        required
                    />

                    <Button type="submit" disabled={loading}>
                        {loading ? "Creating account..." : "Create Account"}
                    </Button>
                </form>

                <div className={styles.authFooter}>
                    <p>
                        Already have an account?{" "}
                        <Link to="/login" className={styles.authLink}>
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
