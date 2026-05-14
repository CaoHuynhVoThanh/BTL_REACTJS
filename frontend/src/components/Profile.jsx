import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Profile.css';

const API = 'http://127.0.0.1:8000/api';

const EMPTY_FORM = { full_name: '', phone: '', address: '', is_default: false };

function Profile({ onOpenAuth }) {
    const location = useLocation();
    const getInitialTab = () => new URLSearchParams(location.search).get('tab') || 'account';
    const [activeTab, setActiveTab] = useState(getInitialTab);
    const navigate = useNavigate();

    const token = localStorage.getItem('access');

    /* ── Account info ──────────────────────────────────────────── */
    const [formData, setFormData] = useState({
        fullName: '', phone: '', email: '',
        currentPassword: '', newPassword: '', confirmPassword: ''
    });

    /* ── Orders ────────────────────────────────────────────────── */
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);

    /* ── Addresses ─────────────────────────────────────────────── */
    const [addresses, setAddresses] = useState([]);
    const [addrLoading, setAddrLoading] = useState(false);
    const [showAddrModal, setShowAddrModal] = useState(false);
    const [editingAddr, setEditingAddr] = useState(null); // null = add, object = edit
    const [addrForm, setAddrForm] = useState(EMPTY_FORM);
    const [addrError, setAddrError] = useState('');
    const [showDeleteAddrModal, setShowDeleteAddrModal] = useState(false);
    const [addrToDelete, setAddrToDelete] = useState(null);

    /* ── Logout modal ──────────────────────────────────────────── */
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    /* ── Notification ──────────────────────────────────────────── */
    const [notification, setNotification] = useState({ show: false, type: 'success', msg: '' });
    const showNotif = (msg, type = 'success') => {
        setNotification({ show: true, type, msg });
        setTimeout(() => setNotification(n => ({ ...n, show: false })), 3000);
    };

    /* ── Fetch addresses ───────────────────────────────────────── */
    const fetchAddresses = async () => {
        if (!token) return;
        setAddrLoading(true);
        try {
            const res = await fetch(`${API}/addresses/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                // If the backend has pagination enabled, the array will be in data.results
                setAddresses(data.results ? data.results : data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setAddrLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'addresses') fetchAddresses();
    }, [activeTab]);

    const fetchOrders = async () => {
        if (!token) return;
        setOrdersLoading(true);
        try {
            const res = await fetch(`${API}/orders/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setOrders(data.results ? data.results : data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setOrdersLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'orders') fetchOrders();
    }, [activeTab]);

    useEffect(() => {
        const tab = new URLSearchParams(location.search).get('tab');
        if (tab) setActiveTab(tab);
    }, [location.search]);

    /* ── Handlers: account ─────────────────────────────────────── */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();
        showNotif('Đã lưu thông tin cá nhân!');
    };

    const handleChangePassword = (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            showNotif('Mật khẩu xác nhận không khớp!', 'error');
            return;
        }
        showNotif('Đã đổi mật khẩu thành công!');
        setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    };

    /* ── Handlers: addresses ───────────────────────────────────── */
    const openAddModal = () => {
        setEditingAddr(null);
        setAddrForm(EMPTY_FORM);
        setAddrError('');
        setShowAddrModal(true);
    };

    const openEditModal = (addr) => {
        setEditingAddr(addr);
        setAddrForm({
            full_name: addr.full_name,
            phone: addr.phone,
            address: addr.address,
            is_default: addr.is_default,
        });
        setAddrError('');
        setShowAddrModal(true);
    };

    const handleAddrFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAddrForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        if (!addrForm.full_name.trim() || !addrForm.phone.trim() || !addrForm.address.trim()) {
            setAddrError('Vui lòng điền đầy đủ thông tin.');
            return;
        }
        setAddrError('');
        try {
            const url = editingAddr
                ? `${API}/addresses/${editingAddr.id}/`
                : `${API}/addresses/`;
            const method = editingAddr ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(addrForm)
            });

            if (res.ok) {
                setShowAddrModal(false);
                await fetchAddresses();
                showNotif(editingAddr ? 'Đã cập nhật địa chỉ!' : 'Đã thêm địa chỉ mới!');

                // Nếu is_default = true → gọi set-default
                if (addrForm.is_default) {
                    const saved = await res.json().catch(() => null);
                    // already set via field; but call endpoint to un-default others
                    if (saved?.id) {
                        await fetch(`${API}/addresses/${saved.id}/set-default/`, {
                            method: 'POST',
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        await fetchAddresses();
                    }
                }
            } else {
                const err = await res.json();
                setAddrError(JSON.stringify(err));
            }
        } catch (e) {
            setAddrError('Lỗi kết nối máy chủ.');
        }
    };

    const handleSetDefault = async (id) => {
        try {
            const res = await fetch(`${API}/addresses/${id}/set-default/`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                await fetchAddresses();
                showNotif('Đã đặt làm địa chỉ mặc định!');
            }
        } catch (e) {
            console.error(e);
        }
    };

    const openDeleteModal = (addr) => {
        setAddrToDelete(addr);
        setShowDeleteAddrModal(true);
    };

    const handleConfirmDeleteAddr = async () => {
        if (!addrToDelete) return;
        try {
            const res = await fetch(`${API}/addresses/${addrToDelete.id}/`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok || res.status === 204) {
                setShowDeleteAddrModal(false);
                setAddrToDelete(null);
                await fetchAddresses();
                showNotif('Đã xóa địa chỉ!');
            }
        } catch (e) {
            console.error(e);
        }
    };

    /* ── Logout ────────────────────────────────────────────────── */
    const handleLogout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('user');
        setShowLogoutModal(false);
        navigate('/');
    };

    /* ─────────────────────────── RENDER ─────────────────────── */
    return (
        <div className="container profile-page">
            {/* Toast notification */}
            {notification.show && (
                <div className={`profile-toast ${notification.type}`}>{notification.msg}</div>
            )}

            <div className="profile-container">
                {/* Sidebar */}
                <div className="profile-sidebar">
                    <div className="profile-avatar">
                        <img src="/testItem.png" alt="Avatar" />
                    </div>
                    <h3>{formData.fullName || 'Tài khoản'}</h3>
                    <p className="profile-email">
                        {formData.email || (token ? 'Đã đăng nhập' : (
                            <button onClick={onOpenAuth} className="auth-link-btn">Đăng nhập</button>
                        ))}
                    </p>
                    <ul className="profile-menu">
                        <li className={activeTab === 'account' ? 'active' : ''} onClick={() => setActiveTab('account')}>
                            Thông tin tài khoản
                        </li>
                        <li className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
                            Lịch sử thanh toán
                        </li>
                        <li className={activeTab === 'addresses' ? 'active' : ''} onClick={() => setActiveTab('addresses')}>
                            Sổ địa chỉ
                        </li>
                        {token && (
                            <li style={{ color: '#ef4444', fontWeight: '700' }} onClick={() => setShowLogoutModal(true)}>
                                Đăng xuất
                            </li>
                        )}
                    </ul>
                </div>

                {/* Content */}
                <div className="profile-content">
                    {/* ── Account tab ─────────────────────────────── */}
                    {activeTab === 'account' && (
                        <>
                            <div className="profile-section">
                                <h2>Thông tin cá nhân</h2>
                                {!token ? (
                                    <p style={{ color: '#6b7280' }}>
                                        Vui lòng <button onClick={onOpenAuth} className="auth-link-btn">đăng nhập</button> để xem thông tin.
                                    </p>
                                ) : (
                                    <form onSubmit={handleSaveProfile} className="profile-form">
                                        <div className="form-group">
                                            <label>Họ và tên</label>
                                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>Số điện thoại <span className="required">*</span></label>
                                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Email</label>
                                            <input type="email" name="email" value={formData.email} onChange={handleChange} />
                                        </div>
                                        <button type="submit" className="save-btn">Lưu thông tin</button>
                                    </form>
                                )}
                            </div>

                            {token && (
                                <div className="profile-section password-section">
                                    <h2>Đổi mật khẩu</h2>
                                    <form onSubmit={handleChangePassword} className="profile-form">
                                        <div className="form-group">
                                            <label>Mật khẩu hiện tại</label>
                                            <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} placeholder="Nhập mật khẩu hiện tại" />
                                        </div>
                                        <div className="form-group">
                                            <label>Mật khẩu mới</label>
                                            <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} placeholder="Nhập mật khẩu mới" />
                                        </div>
                                        <div className="form-group">
                                            <label>Xác nhận mật khẩu mới</label>
                                            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Nhập lại mật khẩu mới" />
                                        </div>
                                        <button type="submit" className="save-btn password-btn">Đổi mật khẩu</button>
                                    </form>
                                </div>
                            )}
                        </>
                    )}

                    {/* ── Orders tab ──────────────────────────────── */}
                    {activeTab === 'orders' && (
                        <div className="profile-section">
                            <h2>Lịch sử thanh toán</h2>
                            {!token ? (
                                <p style={{ color: '#6b7280' }}>
                                    Vui lòng <button onClick={onOpenAuth} className="auth-link-btn">đăng nhập</button> để xem đơn hàng.
                                </p>
                            ) : ordersLoading ? (
                                <p>Đang tải lịch sử thanh toán...</p>
                            ) : orders.length === 0 ? (
                                <p style={{ color: '#9ca3af' }}>Chưa có đơn hàng nào.</p>
                            ) : (
                                <div className="orders-list">
                                    <table className="orders-table">
                                        <thead>
                                            <tr>
                                                <th>Mã đơn hàng</th>
                                                <th>Ngày đặt</th>
                                                <th>Sản phẩm</th>
                                                <th>Tổng tiền</th>
                                                <th>Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map(order => (
                                                <tr key={order.id}>
                                                    <td><strong>{order.code}</strong></td>
                                                    <td>{new Date(order.created_at).toLocaleDateString('vi-VN')}</td>
                                                    <td>{order.items?.length || 0} sản phẩm</td>
                                                    <td><strong>{Number(order.total_amount || 0).toLocaleString('vi-VN')}đ</strong></td>
                                                    <td><span className={`status-badge ${order.status === 'cancelled' ? 'cancelled' : 'success'}`}>{order.status_display}</span></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Addresses tab ───────────────────────────── */}
                    {activeTab === 'addresses' && (
                        <div className="profile-section">
                            <div className="section-header-flex">
                                <h2>Sổ địa chỉ</h2>
                                {token && <button className="add-btn" onClick={openAddModal}>+ Thêm địa chỉ mới</button>}
                            </div>

                            {!token && (
                                <p style={{ color: '#6b7280' }}>
                                    Vui lòng <button onClick={onOpenAuth} className="auth-link-btn">đăng nhập</button> để xem sổ địa chỉ.
                                </p>
                            )}

                            {addrLoading && <p>Đang tải...</p>}

                            <div className="addresses-list">
                                {addresses.length === 0 && !addrLoading && token && (
                                    <p style={{ color: '#9ca3af' }}>Chưa có địa chỉ nào. Hãy thêm địa chỉ mới!</p>
                                )}
                                {addresses.map(addr => (
                                    <div className={`address-card ${addr.is_default ? 'addr-default' : ''}`} key={addr.id}>
                                        <div className="address-info">
                                            <div className="address-name">
                                                <strong>{addr.full_name}</strong>
                                                {addr.is_default && <span className="default-badge">Mặc định</span>}
                                            </div>
                                            <div className="address-detail">
                                                <p><strong>Điện thoại:</strong> {addr.phone}</p>
                                                <p><strong>Địa chỉ:</strong> {addr.address}</p>
                                            </div>
                                        </div>
                                        <div className="address-actions">
                                            {!addr.is_default && (
                                                <button className="set-default-link" onClick={() => handleSetDefault(addr.id)}>
                                                    Đặt mặc định
                                                </button>
                                            )}
                                            <button className="edit-link" onClick={() => openEditModal(addr)}>Sửa</button>
                                            {!addr.is_default && (
                                                <button className="delete-link" onClick={() => openDeleteModal(addr)}>Xóa</button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Modal: Add / Edit address ──────────────────────── */}
            {showAddrModal && (
                <div className="modal-overlay">
                    <div className="modal-content addr-modal">
                        <h3>{editingAddr ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}</h3>
                        <form onSubmit={handleSaveAddress} className="profile-form">
                            <div className="form-group">
                                <label>Họ và tên <span className="required">*</span></label>
                                <input
                                    type="text"
                                    name="full_name"
                                    value={addrForm.full_name}
                                    onChange={handleAddrFormChange}
                                    placeholder="Nguyễn Văn A"
                                />
                            </div>
                            <div className="form-group">
                                <label>Số điện thoại <span className="required">*</span></label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={addrForm.phone}
                                    onChange={handleAddrFormChange}
                                    placeholder="0901234567"
                                />
                            </div>
                            <div className="form-group">
                                <label>Địa chỉ <span className="required">*</span></label>
                                <textarea
                                    name="address"
                                    value={addrForm.address}
                                    onChange={handleAddrFormChange}
                                    rows={3}
                                    placeholder="Số nhà, đường, phường, quận, thành phố"
                                />
                            </div>
                            <div className="form-group form-group-inline">
                                <input
                                    type="checkbox"
                                    id="is_default"
                                    name="is_default"
                                    checked={addrForm.is_default}
                                    onChange={handleAddrFormChange}
                                />
                                <label htmlFor="is_default" style={{ fontWeight: 500 }}>Đặt làm địa chỉ mặc định</label>
                            </div>
                            {addrError && <p className="addr-error">{addrError}</p>}
                            <div className="modal-actions" style={{ justifyContent: 'flex-end' }}>
                                <button type="button" className="cancel-btn" onClick={() => setShowAddrModal(false)}>Hủy</button>
                                <button type="submit" className="save-btn" style={{ margin: 0 }}>
                                    {editingAddr ? 'Cập nhật' : 'Thêm địa chỉ'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Modal: Confirm delete address ─────────────────── */}
            {showDeleteAddrModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Xác nhận xóa địa chỉ</h3>
                        <p>Bạn có chắc muốn xóa địa chỉ của <strong>{addrToDelete?.full_name}</strong>?</p>
                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={() => setShowDeleteAddrModal(false)}>Hủy</button>
                            <button className="confirm-logout-btn" onClick={handleConfirmDeleteAddr}>Xóa</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Modal: Logout ──────────────────────────────────── */}
            {showLogoutModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Xác nhận đăng xuất</h3>
                        <p>Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?</p>
                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={() => setShowLogoutModal(false)}>Hủy</button>
                            <button className="confirm-logout-btn" onClick={handleLogout}>Đăng xuất</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;
