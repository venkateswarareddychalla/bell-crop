import { useState, useEffect } from "react";
import Navbar from "../../components/Layout/Navbar";
import { useTransactions } from "../../context/TransactionContext";
import SearchBar from "./SearchBar";
import Filters from "./Filters";
import TransactionGrid from "./TransactionGrid";
import styles from "./Explorer.module.css";

const Explorer = () => {
    const { searchTransactions } = useTransactions();
    const [searchParams, setSearchParams] = useState({
        q: "",
        category: "",
        startDate: "",
        endDate: "",
        minAmount: "",
        maxAmount: "",
        page: 1,
        limit: 20,
    });
    const [results, setResults] = useState({ transactions: [], pagination: null });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchResults();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    const fetchResults = async () => {
        setLoading(true);
        // Filter out empty params
        const params = Object.fromEntries(
            Object.entries(searchParams).filter(([_, v]) => v !== "")
        );
        const data = await searchTransactions(params);
        if (data) {
            // If page is 1, replace results. Otherwise, append for "Load More"
            if (searchParams.page === 1) {
                setResults(data);
            } else {
                setResults((prev) => ({
                    ...data,
                    transactions: [...prev.transactions, ...data.transactions],
                }));
            }
        }
        setLoading(false);
    };

    const handleSearch = (query) => {
        setSearchParams({ ...searchParams, q: query, page: 1 });
    };

    const handleFilter = (filters) => {
        setSearchParams({ ...searchParams, ...filters, page: 1 });
    };

    const handleLoadMore = () => {
        setSearchParams({ ...searchParams, page: searchParams.page + 1 });
    };

    const handleClearFilters = () => {
        setSearchParams({
            q: "",
            category: "",
            startDate: "",
            endDate: "",
            minAmount: "",
            maxAmount: "",
            page: 1,
            limit: 20,
        });
    };

    return (
        <div className={styles.explorerWrapper}>
            <Navbar />
            <div className={styles.explorerContainer}>
                <div className={styles.explorerHeader}>
                    <h1>Transaction Explorer</h1>
                    <p>Search and filter your transaction history</p>
                </div>

                <SearchBar initialValue={searchParams.q} onSearch={handleSearch} />

                <Filters
                    filters={{
                        category: searchParams.category,
                        startDate: searchParams.startDate,
                        endDate: searchParams.endDate,
                        minAmount: searchParams.minAmount,
                        maxAmount: searchParams.maxAmount,
                    }}
                    onFilter={handleFilter}
                    onClear={handleClearFilters}
                />

                <TransactionGrid
                    transactions={results.transactions}
                    pagination={results.pagination}
                    loading={loading}
                    onLoadMore={handleLoadMore}
                />
            </div>
        </div>
    );
};

export default Explorer;
