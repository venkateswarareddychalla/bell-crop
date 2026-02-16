import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTransactions } from "../../context/TransactionContext";
import Navbar from "../../components/Layout/Navbar";
import SummaryCard from "./SummaryCard";
import CategoryChart from "./CategoryChart";
import RecentTransactions from "./RecentTransactions";
import Button from "../../components/UI/Button";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
    const { dashboardData, fetchDashboardData, loading } = useTransactions();
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    return (
        <div className={styles.dashboardWrapper}>
            <Navbar />
            <div className={styles.dashboardContainer}>
                <div className={styles.dashboardHeader}>
                    <h1>Dashboard</h1>
                    <Button onClick={() => navigate("/transactions")}>
                        Add Transaction
                    </Button>
                </div>

                {loading && <div className={styles.loading}>Loading dashboard...</div>}

                {!loading && dashboardData.summary && (
                    <>
                        <div className={styles.summaryGrid}>
                            <SummaryCard
                                title="Total Expenses"
                                value={dashboardData.summary.totalExpenses}
                                type="currency"
                                icon="💵"
                            />
                            <SummaryCard
                                title="Total Transactions"
                                value={dashboardData.summary.totalTransactions}
                                type="number"
                                icon="📊"
                            />
                            <SummaryCard
                                title="Average Transaction"
                                value={dashboardData.summary.averageTransaction}
                                type="currency"
                                icon="📈"
                            />
                            <SummaryCard
                                title="This Month"
                                value={dashboardData.summary.currentMonthExpenses}
                                type="currency"
                                icon="📅"
                            />
                        </div>

                        <div className={styles.chartsGrid}>
                            <CategoryChart categories={dashboardData.categories} />
                            <RecentTransactions transactions={dashboardData.recent} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
