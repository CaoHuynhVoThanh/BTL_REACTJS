import "./CategoryPage.css"
import { useState, useEffect } from "react"
import { useParams, useLocation } from "react-router-dom"
import Item from "./Item"
import filterConfig from "./filterConfig"
import { apiPath, cachedJsonFetch, cacheTtl } from "../utils/api"

function CategoryPage() {
    const { category } = useParams();
    const location = useLocation();
    
    // Lấy keyword từ URL (?q=...)
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("q");

    const isSearch = location.pathname.startsWith("/search");
    const configKey = isSearch ? "search" : (category || "gfx");
    const config = filterConfig[configKey] || filterConfig["gfx"];

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0);

    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(200000000);
    const [debouncedMinPrice, setDebouncedMinPrice] = useState(0);
    const [debouncedMaxPrice, setDebouncedMaxPrice] = useState(200000000);
    const [sortBy, setSortBy] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const [checkedFilters, setCheckedFilters] = useState({});
    
    const minLimit = 0;
    const maxLimit = 300000000;
    const itemsPerPage = 8;

    // Mapping category từ URL sang series slug của backend
    const categoryMapping = {
        "gfx": "gfx-series",
        "x-series": "x-series",
        "ong-kinh": "lens",
        "instax": "instax",
        "film": "film",
        "phu-kien": "accessories"
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            // Build query params
            const params = new URLSearchParams();
            params.append("page", currentPage);
            params.append("page_size", itemsPerPage);
            
            if (isSearch && searchQuery) {
                params.append("search", searchQuery);
            } else {
                const seriesSlug = categoryMapping[category] || category;
                params.append("series", seriesSlug);
            }
            
            if (debouncedMinPrice > 0) params.append("min_price", debouncedMinPrice);
            if (debouncedMaxPrice < 200000000) params.append("max_price", debouncedMaxPrice);
            
            const sortByMapping = {
                "newest": "-created_at",
                "oldest": "created_at",
                "name-asc": "name",
                "name-desc": "-name",
                "price-asc": "min_price",
                "price-desc": "-min_price"
            };
            if (sortBy) params.append("ordering", sortByMapping[sortBy]);
            
            // Thêm các bộ lọc động (checkbox)
            Object.entries(checkedFilters).forEach(([key, values]) => {
                if (values.length > 0) {
                    // Đối với search, key có thể là 'type' hoặc 'series' trực tiếp
                    params.append(key, values.join(','));
                }
            });

            const url = apiPath(`/products/?${params.toString()}`);
            const data = await cachedJsonFetch(url, {
                cacheKey: `products:stock-v1:${url}`,
                ttl: cacheTtl.medium,
            });
            
            if (data.results) {
                setProducts(data.results);
                setTotalItems(data.count);
            } else if (Array.isArray(data)) {
                setProducts(data);
                setTotalItems(data.length);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    // Debounce price changes
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedMinPrice(minPrice);
            setDebouncedMaxPrice(maxPrice);
        }, 500);

        return () => clearTimeout(handler);
    }, [minPrice, maxPrice]);

    // Fetch data khi các yếu tố thay đổi
    useEffect(() => {
        fetchProducts();
    }, [category, searchQuery, currentPage, debouncedMinPrice, debouncedMaxPrice, sortBy, checkedFilters]);

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Reset filters khi đổi category hoặc tìm kiếm mới
    useEffect(() => {
        setCheckedFilters({});
        setMinPrice(0);
        setMaxPrice(200000000);
        setDebouncedMinPrice(0);
        setDebouncedMaxPrice(200000000);
        setSortBy("newest");
        setCurrentPage(1);
    }, [configKey, searchQuery]);

    // Reset page khi thay đổi bộ lọc
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedMinPrice, debouncedMaxPrice, sortBy, checkedFilters]);
    
    // ... existing handlers ...
    const handleMinChange = (e) => {
        const value = Math.min(Number(e.target.value), maxPrice - 10000000);
        setMinPrice(value);
    };
    const handleMaxChange = (e) => {
        const value = Math.max(Number(e.target.value), minPrice + 10000000);
        setMaxPrice(value);
    };

    const handleCheckboxChange = (filterKey, optionValue) => {
        setCheckedFilters(prev => {
            const current = prev[filterKey] || [];
            if (current.includes(optionValue)) {
                return { ...prev, [filterKey]: current.filter(v => v !== optionValue) };
            } else {
                return { ...prev, [filterKey]: [...current, optionValue] };
            }
        });
    };

    const sortOptions = [
        { value: "newest", label: "Mới nhất" },
        { value: "oldest", label: "Cũ nhất" },
        { value: "name-asc", label: "Tên A → Z" },
        { value: "name-desc", label: "Tên Z → A" },
        { value: "price-asc", label: "Giá tăng dần" },
        { value: "price-desc", label: "Giá giảm dần" },
    ];

    const handlePageChange = (page) => {
        if (page >= 1 && (totalPages === 0 || page <= totalPages)) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    // Đếm số filter đang active
    const activeFilterCount = Object.values(checkedFilters).reduce(
        (sum, arr) => sum + arr.length, 0
    );

    const clearAllFilters = () => {
        setCheckedFilters({});
        setMinPrice(0);
        setMaxPrice(200000000);
    };

    return (
        <div className="container category-page">
            {/* ===== Sidebar Filter ===== */}
            <div className="panelLeft">
                <div className="panel-header">
                    <div className="type">{config.title}</div>
                    {activeFilterCount > 0 && (
                        <button className="clear-filters-btn" onClick={clearAllFilters}>
                            Xoá bộ lọc ({activeFilterCount})
                        </button>
                    )}
                </div>

                {/* Khoảng giá — luôn hiển thị */}
                <div className="filter-group">
                    <div className="filter-title">Khoảng giá</div>
                    <div className="double-range-slider">
                        <div className="slider-track" style={{
                            left: `${(minPrice / maxLimit) * 100}%`,
                            right: `${100 - (maxPrice / maxLimit) * 100}%`
                        }}></div>
                        <input
                            type="range"
                            min={minLimit}
                            max={maxLimit}
                            value={minPrice}
                            onChange={handleMinChange}
                            className="range-input"
                        />
                        <input
                            type="range"
                            min={minLimit}
                            max={maxLimit}
                            value={maxPrice}
                            onChange={handleMaxChange}
                            className="range-input"
                        />
                    </div>
                    <div className="price-display">
                        <span>{minPrice.toLocaleString()}đ</span>
                        <span className="price-separator">—</span>
                        <span>{maxPrice.toLocaleString()}đ</span>
                    </div>
                </div>

                {/* Filter động từ config */}
                {config.filters.map((filter) => (
                    <div className="filter-group" key={filter.key}>
                        <div className="filter-title">{filter.title}</div>
                        <div className="checkbox-group">
                            {filter.options.map((option) => (
                                <label key={option}>
                                    <input
                                        type="checkbox"
                                        value={option}
                                        checked={(checkedFilters[filter.key] || []).includes(option)}
                                        onChange={() => handleCheckboxChange(filter.key, option)}
                                    />
                                    <span>{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* ===== Main Content ===== */}
            <div className="main-content">
                {/* Sort Bar */}
                <div className="sort-bar">
                    <div className="sort-bar-left">
                        <span className="result-count">Hiển thị <strong>{products.length}</strong> / {totalItems} sản phẩm</span>
                    </div>
                    <div className="sort-bar-right">
                        <span className="sort-label">Sắp xếp:</span>
                        <div className="sort-select-wrapper">
                            <select
                                className="sort-select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                {sortOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="product-list">
                    {loading ? (
                        <div className="loading">Đang tải sản phẩm...</div>
                    ) : products.length > 0 ? (
                        products.map(product => (
                            <Item key={product.id} product={product} />
                        ))
                    ) : (
                        <div className="no-products">Không có sản phẩm hiển thị</div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            className="page-btn page-nav"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            ‹
                        </button>

                        {getPageNumbers()[0] > 1 && (
                            <>
                                <button className="page-btn" onClick={() => handlePageChange(1)}>1</button>
                                {getPageNumbers()[0] > 2 && <span className="page-dots">…</span>}
                            </>
                        )}

                        {getPageNumbers().map((page) => (
                            <button
                                key={page}
                                className={`page-btn ${currentPage === page ? "active" : ""}`}
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </button>
                        ))}

                        {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
                            <>
                                {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && <span className="page-dots">…</span>}
                                <button className="page-btn" onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
                            </>
                        )}

                        <button
                            className="page-btn page-nav"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            ›
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CategoryPage;
