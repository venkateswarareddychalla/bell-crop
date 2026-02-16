import { useState, useEffect } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import explorerStyles from "./Explorer.module.css";
import transactionStyles from "../Transactions/Transactions.module.css";

const SearchBar = ({ initialValue = "", onSearch, context = "explorer" }) => {
    const [searchTerm, setSearchTerm] = useState(initialValue);
    const debouncedSearch = useDebounce(searchTerm, 500);

    // Use appropriate styles based on context
    const styles = context === "transactions" ? transactionStyles : explorerStyles;

    useEffect(() => {
        onSearch(debouncedSearch);
    }, [debouncedSearch, onSearch]);

    return (
        <div className={styles.searchBar || explorerStyles.searchBar}>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title or notes..."
                className={styles.searchInput || explorerStyles.searchInput}
            />
            <span className={styles.searchIcon || explorerStyles.searchIcon}>🔍</span>
        </div>
    );
};

export default SearchBar;
