import "./GfxBody.css"
import { useState } from "react"
import Item from "./Item"

function GfxBody() {
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(200000000);
    const [sortBy, setSortBy] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const minLimit = 0;
    const maxLimit = 300000000;
    const itemsPerPage = 8;
    const totalItems = 24; // Tổng số sản phẩm (thay bằng dữ liệu thực)
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handleMinChange = (e) => {
        const value = Math.min(Number(e.target.value), maxPrice - 10000000);
        setMinPrice(value);
    };
    const handleMaxChange = (e) => {
        const value = Math.max(Number(e.target.value), minPrice + 10000000);
        setMaxPrice(value);
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
        if (page >= 1 && page <= totalPages) {
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

    return (
        <div className="container gfx-body">
            {/* ===== Sidebar Filter ===== */}
            <div className="panelLeft">
                <div className="type">GFX Series</div>

                {/* Khoảng giá */}
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

                {/* Loại sản phẩm
                <div className="filter-group">
                    <div className="filter-title">Loại sản phẩm</div>
                    <div className="checkbox-group">
                        <label>
                            <input type="checkbox" value="Máy ảnh" />
                            <span>Máy ảnh</span>
                        </label>
                        <label>
                            <input type="checkbox" value="Ống kính" />
                            <span>Ống kính</span>
                        </label>
                    </div>
                </div> */}

                {/* Kiểu dáng */}
                <div className="filter-group">
                    <div className="filter-title">Kiểu dáng</div>
                    <div className="checkbox-group">
                        <label>
                            <input type="checkbox" value="DSLR" />
                            <span>DSLR</span>
                        </label>
                        <label>
                            <input type="checkbox" value="Rangefinder" />
                            <span>Rangefinder</span>
                        </label>
                    </div>
                </div>

                {/* Viewfinder */}
                <div className="filter-group">
                    <div className="filter-title">Viewfinder</div>
                    <div className="checkbox-group">
                        <label>
                            <input type="checkbox" value="EVF" />
                            <span>EVF</span>
                        </label>
                        <label>
                            <input type="checkbox" value="EVF/OVF" />
                            <span>EVF/OVF</span>
                        </label>
                        <label>
                            <input type="checkbox" value="Không có viewfinder" />
                            <span>Không có viewfinder</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* ===== Main Content ===== */}
            <div className="main-content">
                {/* Sort Bar */}
                <div className="sort-bar">
                    <div className="sort-bar-left">
                        <span className="result-count">Hiển thị <strong>{itemsPerPage}</strong> / {totalItems} sản phẩm</span>
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
                    <Item />
                    <Item />
                </div>

                {/* Pagination */}
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
            </div>
        </div>
    )
}

export default GfxBody;