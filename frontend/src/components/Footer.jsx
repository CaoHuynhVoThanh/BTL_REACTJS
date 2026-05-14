import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer-container">
            <div className="container footer-content-wrapper">
                <div className="footer-content">
                    <div className="footer-company-info">
                        <img src="/FUJIFILM-Logo-white.png" alt="Fujifilm Logo" className="footer-logo" />
                        <div className="info-details">
                            <p><strong>Chi Nhánh Hồ Chí Minh:</strong> Tầng G - Toà nhà The Hallmark - số 15 đường Trần Bạch Đằng, Phường Thủ Thiêm, Thành Phố Thủ Đức, Thành Phố Hồ Chí Minh.</p>
                            <p><strong>Điện thoại:</strong> (028) 3939 0847 - Số máy lẻ: 250</p>
                            <p><strong>Email:</strong> kinhdoanh.fujifilmxspace.vn@gmail.com</p>
                            <p><strong>Giờ làm việc:</strong><br />08:30 AM - 05:30 PM từ thứ Hai đến thứ Sáu.<br />09:00 AM - 12:00 PM và 1:00 PM - 4:00 PM vào Thứ Bảy (Trừ ngày Lễ)</p>
                        </div>
                    </div>
                    <div className="footer-links-section">
                        <div className="footer-col">
                            <h4>Mua hàng</h4>
                            <ul>
                                <li><Link to="/category/x-series">Máy ảnh</Link></li>
                                <li><Link to="/category/ong-kinh">Ống kính</Link></li>
                                <li><Link to="/category/instax">Instax</Link></li>
                                <li><Link to="/category/film">Film</Link></li>
                                <li><Link to="/category/phu-kien">Phụ kiện</Link></li>
                            </ul>
                        </div>
                        <div className="footer-col">
                            <h4>Hỗ trợ</h4>
                            <ul>
                                <li><Link to="/pages/chinh-sach-mua-hang">Mua hàng</Link></li>
                                <li><Link to="/pages/chinh-sach-giao-nhan">Vận chuyển</Link></li>
                                <li><Link to="/pages/chinh-sach-hoan-tra">Trả hàng</Link></li>
                                <li><Link to="/pages/chinh-sach-bao-hanh">Bảo hành</Link></li>
                            </ul>
                        </div>
                        <div className="footer-col">
                            <h4>Công ty</h4>
                            <ul>
                                <li><Link to="/pages/ve-chung-toi">Về chúng tôi</Link></li>
                                <li><Link to="/pages/lien-he">Liên hệ</Link></li>
                                <li><Link to="/pages/chinh-sach-bao-mat">Chính sách bảo mật</Link></li>
                                <li><Link to="/pages/dieu-khoan-dich-vu">Điều khoản dịch vụ</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-map">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d244.96485274085492!2d106.7139931!3d10.7777543!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f87c0196629%3A0xf4e1a19404218149!2sFujifilm%20X-Space%20Vi%E1%BB%87t%20Nam!5e0!3m2!1sen!2s!4v1716800716827!5m2!1sen!2s" 
                            width="600" 
                            height="450" 
                            style={{ border: 0 }} 
                            allowFullScreen="" 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade">
                        </iframe>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} FUJIFILM. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
