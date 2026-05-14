import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"
import "./Header.css"
import { apiPath, cachedJsonFetch, cacheTtl } from "../utils/api"

const moreNavLinks = [
    { to: "/pages/ve-chung-toi", label: "Về chúng tôi" },
    { to: "/pages/chinh-sach-mua-hang", label: "Chính sách mua hàng" },
    { to: "/pages/chinh-sach-giao-nhan", label: "Chính sách giao nhận" },
    { to: "/pages/chinh-sach-hoan-tra", label: "Chính sách hoàn trả" },
    { to: "/pages/chinh-sach-bao-hanh", label: "Chính sách bảo hành" },
    { to: "/pages/chinh-sach-bao-mat", label: "Chính sách bảo mật" },
    { to: "/pages/dieu-khoan-dich-vu", label: "Điều khoản dịch vụ" },
];

function Header({ onOpenAuth }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showMoreNav, setShowMoreNav] = useState(false);
    const navigate = useNavigate();

    // Fetch suggestions as user types
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.trim().length > 1) {
                try {
                    const url = apiPath(`/products/?search=${encodeURIComponent(searchQuery)}&page_size=3`);
                    const data = await cachedJsonFetch(url, { ttl: cacheTtl.short });
                    setSuggestions(data.results || []);
                    setShowSuggestions(true);
                } catch (error) {
                    console.error("Error fetching suggestions:", error);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        };

        const timeoutId = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleSearch = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            if (searchQuery.trim()) {
                navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                setShowSuggestions(false);
            }
        }
    };

    const handleSuggestionClick = (productId) => {
        navigate(`/product/${productId}`);
        setSearchQuery("");
        setShowSuggestions(false);
    };

    const formatProductPrice = (product) => {
        const formatPrice = (price) => (
            new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(price))
        );
        const minPrice = product.min_price || product.base_price;
        const maxPrice = product.max_price || product.base_price;
        if (!minPrice) return "Liên hệ";
        if (Number(minPrice) === Number(maxPrice)) return formatPrice(minPrice);
        return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
    };

    return( 
        <div className="header">
            <div className="container">
                <div className="head-left">
                    <Link to="/">
                        <img src="/FUJIFILM-Logo-white.png" alt="Fujifilm Logo"></img>
                    </Link>
                </div>
                <div className="search-bar">
                    <div className="search-input-wrapper">
                        <input 
                            type="text" 
                            placeholder="Bạn muốn tìm gì..." 
                            aria-label="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                            onFocus={() => searchQuery.trim().length > 1 && setShowSuggestions(true)}
                        ></input>
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="search-suggestions">
                                {suggestions.map(product => (
                                    <div 
                                        key={product.id} 
                                        className="suggestion-item"
                                        onClick={() => handleSuggestionClick(product.id)}
                                    >
                                        <img src={product.thumbnail || "/testItem.png"} alt={product.name} />
                                        <div className="suggestion-info">
                                            <p className="suggestion-name">{product.name}</p>
                                            <p className="suggestion-price">
                                                {formatProductPrice(product)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button onClick={handleSearch}><svg className="material-icons" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#CCCCCC"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg></button>
                </div>
                <div className="head-right">
                    <div className="contact">
                        <div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" height="54px" fill="#CCCCCC"><path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12ZM241-600l66-66-17-94h-89q5 41 14 81t26 79Zm358 358q39 17 79.5 27t81.5 13v-88l-94-19-67 67ZM241-600Zm358 358Z"/></svg></div>
                        <div className="contact-detail">
                            <p>Liên hệ</p>  
                            <p>(028) 3939 0847</p>
                        </div>
                    </div>
                    <div className="notification"><svg className="material-icons" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#CCCCCC"><path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z"/></svg></div>
                    <div className="cart"><Link to="/cart"><svg className="material-icons" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#CCCCCC"><path d="M223.5-103.5Q200-127 200-160t23.5-56.5Q247-240 280-240t56.5 23.5Q360-193 360-160t-23.5 56.5Q313-80 280-80t-56.5-23.5Zm400 0Q600-127 600-160t23.5-56.5Q647-240 680-240t56.5 23.5Q760-193 760-160t-23.5 56.5Q713-80 680-80t-56.5-23.5ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z"/></svg></Link></div>
                    <div className="info">
                        {localStorage.getItem('access') ? (
                            <Link to="/profile">
                                <svg className="material-icons" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#CCCCCC"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm146.5-204.5Q340-521 340-580t40.5-99.5Q421-720 480-720t99.5 40.5Q620-639 620-580t-40.5 99.5Q539-440 480-440t-99.5-40.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm100-95.5q47-15.5 86-44.5-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160q53 0 100-15.5ZM523-537q17-17 17-43t-17-43q-17-17-43-17t-43 17q-17 17-17 43t17 43q17 17 43 17t43-17Zm-43-43Zm0 360Z"/></svg>
                            </Link>
                        ) : (
                            <button onClick={onOpenAuth} style={{background: 'none', border: 'none', cursor: 'pointer', padding: 0}}>
                                <svg className="material-icons" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#CCCCCC"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm146.5-204.5Q340-521 340-580t40.5-99.5Q421-720 480-720t99.5 40.5Q620-639 620-580t-40.5 99.5Q539-440 480-440t-99.5-40.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm100-95.5q47-15.5 86-44.5-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160q53 0 100-15.5ZM523-537q17-17 17-43t-17-43q-17-17-43-17t-43 17q-17 17-17 43t17 43q17 17 43 17t43-17Zm-43-43Zm0 360Z"/></svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div className="nav-ouline">
                <div className="container">
                <div className="nav">
                    <div className="nav-left">
                        <Link to="/" className="home">
                            <svg xmlns="http://www.w3.org/2000/svg" height="26px" viewBox="0 -960 960 960" fill="#ffffff"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/></svg>
                            <p>TRANG CHỦ</p>
                        </Link>
                    </div>
                    <div className="nav-middle">
                        <Link to="/category/gfx" className="category">GFX SERIES</Link>
                        <Link to="/category/x-series" className="category">X SERIES</Link>
                        <Link to="/category/ong-kinh" className="category">Ống kính</Link>
                        <Link to="/category/instax" className="category">INSTAX</Link>
                        <Link to="/category/film" className="category">FILM</Link>
                        <Link to="/category/phu-kien" className="category">PHỤ KIỆN</Link>
                    </div>
                    <div
                        className={`nav-right more-nav ${showMoreNav ? "open" : ""}`}
                        onMouseEnter={() => setShowMoreNav(true)}
                        onMouseLeave={() => setShowMoreNav(false)}
                    >
                        <button
                            type="button"
                            className="more-nav-trigger"
                            aria-haspopup="true"
                            aria-expanded={showMoreNav}
                            onClick={() => setShowMoreNav((current) => !current)}
                        >
                            <span>XEM THÊM</span>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>
                        </button>
                        <div className="more-nav-menu">
                            {moreNavLinks.map((item) => (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    className="more-nav-item"
                                    onClick={() => setShowMoreNav(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}
export default Header;
