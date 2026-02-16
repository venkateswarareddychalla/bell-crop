import { useState, useEffect } from "react";
import { CATEGORIES } from "../../utils/constants";
import Button from "../../components/UI/Button";
import explorerStyles from "./Explorer.module.css";
import transactionStyles from "../Transactions/Transactions.module.css";

const Filters = ({ filters, onFilter, onClear, context = "explorer" }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [localFilters, setLocalFilters] = useState(filters);

    // Use appropriate styles based on context
    const styles = context === "transactions" ? transactionStyles : explorerStyles;

    // Sync local filters when parent filters change
    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    const handleApply = () => {
        onFilter(localFilters);
    };

    const handleClear = () => {
        const emptyFilters = {
            category: "",
            startDate: "",
            endDate: "",
            minAmount: "",
            maxAmount: "",
        };
        setLocalFilters(emptyFilters);
        onClear();
    };

    const activeFilterCount = Object.values(filters).filter((v) => v !== "").length;

    return (
        <div className={styles.filtersContainer || explorerStyles.filtersContainer}>
            <button
                className={styles.filterToggle || explorerStyles.filterToggle}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <span>Filters</span>
                {activeFilterCount > 0 && (
                    <span className={styles.filterBadge || explorerStyles.filterBadge}>{activeFilterCount}</span>
                )}
                <span className={styles.toggleIcon || explorerStyles.toggleIcon}>{isExpanded ? "▲" : "▼"}</span>
            </button>

            {isExpanded && (
                <div className={styles.filterPanel || explorerStyles.filterPanel}>
                    <div className={styles.filterGrid || explorerStyles.filterGrid}>
                        <div className={styles.filterGroup || explorerStyles.filterGroup}>
                            <label>Category</label>
                            <select
                                value={localFilters.category}
                                onChange={(e) =>
                                    setLocalFilters({ ...localFilters, category: e.target.value })
                                }
                                className={styles.filterSelect || explorerStyles.filterSelect}
                            >
                                <option value="">All Categories</option>
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.filterGroup || explorerStyles.filterGroup}>
                            <label>Start Date</label>
                            <input
                                type="date"
                                value={localFilters.startDate}
                                onChange={(e) =>
                                    setLocalFilters({ ...localFilters, startDate: e.target.value })
                                }
                                className={styles.filterInput || explorerStyles.filterInput}
                            />
                        </div>

                        <div className={styles.filterGroup || explorerStyles.filterGroup}>
                            <label>End Date</label>
                            <input
                                type="date"
                                value={localFilters.endDate}
                                onChange={(e) =>
                                    setLocalFilters({ ...localFilters, endDate: e.target.value })
                                }
                                className={styles.filterInput || explorerStyles.filterInput}
                            />
                        </div>

                        <div className={styles.filterGroup || explorerStyles.filterGroup}>
                            <label>Min Amount</label>
                            <input
                                type="number"
                                step="0.01"
                                value={localFilters.minAmount}
                                onChange={(e) =>
                                    setLocalFilters({ ...localFilters, minAmount: e.target.value })
                                }
                                placeholder="0.00"
                                className={styles.filterInput || explorerStyles.filterInput}
                            />
                        </div>

                        <div className={styles.filterGroup || explorerStyles.filterGroup}>
                            <label>Max Amount</label>
                            <input
                                type="number"
                                step="0.01"
                                value={localFilters.maxAmount}
                                onChange={(e) =>
                                    setLocalFilters({ ...localFilters, maxAmount: e.target.value })
                                }
                                placeholder="0.00"
                                className={styles.filterInput || explorerStyles.filterInput}
                            />
                        </div>
                    </div>

                    <div className={styles.filterActions || explorerStyles.filterActions}>
                        <Button variant="secondary" onClick={handleClear}>
                            Clear All
                        </Button>
                        <Button onClick={handleApply}>Apply Filters</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Filters;
