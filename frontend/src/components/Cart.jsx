import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import ItemCart from "./ItemCart";
import {
    changeGuestCartItemColor,
    changeGuestCartItemVariant,
    getGuestCart,
    removeGuestCartItem,
    updateGuestCartItem,
} from "../utils/cartUtils";
import { apiPath } from "../utils/api";

const API = apiPath();

const paymentMethods = [
    { id: "vietqr", label: "VIETQR", description: "Quét mã QR để chuyển khoản nhanh qua ứng dụng ngân hàng." },
    { id: "bank", label: "Ngân hàng", description: "Chuyển khoản thủ công bằng số tài khoản ngân hàng." },
    { id: "atm", label: "Thẻ ATM nội địa", description: "Thanh toán bằng thẻ ATM hoặc Internet Banking nội địa." },
    { id: "visa", label: "Visa / Mastercard", description: "Thanh toán bằng thẻ quốc tế Visa, Mastercard hoặc JCB." },
    { id: "cod", label: "Thanh toán khi nhận hàng", description: "Thanh toán khi nhận sản phẩm theo chính sách cửa hàng." },
];

function Cart({ onOpenAuth }) {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("vietqr");
    const [selectedDomesticBank, setSelectedDomesticBank] = useState("Vietcombank");
    const [loading, setLoading] = useState(true);
    const [addressesLoading, setAddressesLoading] = useState(false);
    const [checkoutSubmitting, setCheckoutSubmitting] = useState(false);
    const [checkoutError, setCheckoutError] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const navigate = useNavigate();

    const token = localStorage.getItem("access");
    const isGuest = !token;

    const fetchCart = async () => {
        if (isGuest) {
            setCartItems(getGuestCart());
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API}/cart/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setCartItems(data.items || []);
            } else if (response.status === 401) {
                localStorage.removeItem("access");
                setCartItems(getGuestCart());
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAddresses = async () => {
        if (!token) return;
        setAddressesLoading(true);
        try {
            const response = await fetch(`${API}/addresses/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                const addressList = data.results || data || [];
                setAddresses(addressList);
                const defaultAddress = addressList.find((address) => address.is_default) || addressList[0];
                if (defaultAddress) setSelectedAddressId(String(defaultAddress.id));
            }
        } catch (error) {
            console.error("Error fetching addresses:", error);
        } finally {
            setAddressesLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    useEffect(() => {
        if (showCheckoutModal) fetchAddresses();
    }, [showCheckoutModal]);

    useEffect(() => {
        document.body.classList.toggle("modal-open", showCheckoutModal || showDeleteModal);
        return () => document.body.classList.remove("modal-open");
    }, [showCheckoutModal, showDeleteModal]);

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) {
            const item = cartItems.find((cartItem) => cartItem.id === itemId);
            if (item) {
                setItemToDelete(item);
                setShowDeleteModal(true);
            }
            return;
        }

        if (isGuest) {
            setCartItems(updateGuestCartItem(itemId, newQuantity));
            return;
        }

        try {
            const response = await fetch(`${API}/cart/${itemId}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ quantity: newQuantity }),
            });
            if (response.ok) {
                const data = await response.json();
                setCartItems(data.items || []);
            }
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    const handleRemoveRequest = (item) => {
        setItemToDelete(item);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;

        if (isGuest) {
            setCartItems(removeGuestCartItem(itemToDelete.id));
            setSelectedItems((prev) => prev.filter((id) => id !== itemToDelete.id));
            setShowDeleteModal(false);
            setItemToDelete(null);
            return;
        }

        try {
            const response = await fetch(`${API}/cart/${itemToDelete.id}/`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setCartItems(data.items || []);
                setSelectedItems((prev) => prev.filter((id) => id !== itemToDelete.id));
                setShowDeleteModal(false);
                setItemToDelete(null);
            }
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    const handleChangeVariant = async (itemId, newVariantId, allVariants) => {
        const newVariant = allVariants.find((variant) => variant.id === newVariantId);
        if (!newVariant) return;

        if (isGuest) {
            setCartItems(changeGuestCartItemVariant(itemId, newVariant));
            return;
        }

        const oldItem = cartItems.find((item) => item.id === itemId);
        if (!oldItem) return;

        try {
            await fetch(`${API}/cart/${itemId}/`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            await fetch(`${API}/cart/add/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ variant_id: newVariantId, quantity: oldItem.quantity }),
            });
            fetchCart();
        } catch (error) {
            console.error("Error changing variant:", error);
        }
    };

    const handleChangeColor = (itemId, newColorId, allColors) => {
        const newColor = allColors.find((color) => color.id === newColorId);
        if (!newColor) return;

        if (isGuest) {
            setCartItems(changeGuestCartItemColor(itemId, newColor));
            return;
        }

        setCartItems((prev) => prev.map((item) => (
            item.id === itemId
                ? { ...item, color_id: newColorId, color_name: newColor.name, color_hex: newColor.hex_code }
                : item
        )));
    };

    const handleSelectAll = (event) => {
        setSelectedItems(event.target.checked ? cartItems.map((item) => item.id) : []);
    };

    const handleSelectItem = (id) => {
        setSelectedItems((prev) => (
            prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
        ));
    };

    const handleCheckoutClick = () => {
        if (!token) {
            onOpenAuth?.();
            return;
        }
        setCheckoutError("");
        setShowCheckoutModal(true);
    };

    const handleConfirmCheckout = async () => {
        if (!selectedAddressId) {
            setCheckoutError("Vui lòng chọn hoặc thêm địa chỉ nhận hàng trước khi thanh toán.");
            return;
        }

        setCheckoutSubmitting(true);
        setCheckoutError("");
        try {
            const response = await fetch(`${API}/checkout/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    cart_item_ids: selectedItems,
                    address_id: Number(selectedAddressId),
                    payment_method: paymentMethod,
                }),
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                setCheckoutError(data.detail || JSON.stringify(data) || "Không thể tạo đơn hàng.");
                return;
            }

            setShowCheckoutModal(false);
            setSelectedItems([]);
            await fetchCart();
            navigate("/profile?tab=orders");
        } catch (error) {
            console.error("Checkout error:", error);
            setCheckoutError("Lỗi kết nối máy chủ. Vui lòng thử lại.");
        } finally {
            setCheckoutSubmitting(false);
        }
    };

    const selectedCartItems = cartItems.filter((item) => selectedItems.includes(item.id));
    const totalPrice = selectedCartItems.reduce((acc, item) => acc + Number(item.subtotal || 0), 0);
    const selectedAddress = addresses.find((address) => String(address.id) === String(selectedAddressId));
    const selectedPayment = paymentMethods.find((method) => method.id === paymentMethod) || paymentMethods[0];
    const formatCurrency = (value) => `${Number(value || 0).toLocaleString("vi-VN")}đ`;
    const orderCode = `DH${selectedItems.length}${Math.round(totalPrice).toString().slice(-6).padStart(6, "0")}`;
    const copyText = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch (error) {
            console.error("Unable to copy text:", error);
        }
    };

    if (loading) return <div className="loading">Đang tải giỏ hàng...</div>;

    return (
        <div className="container cart-container">
            <h2 className="cart-title">Giỏ hàng của bạn</h2>
            <div className="cart-content">
                <div className="cart-items-section">
                    <div className="cart-list-header">
                        <div className="header-col col-checkbox">
                            <input
                                type="checkbox"
                                className="cart-checkbox"
                                checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                                onChange={handleSelectAll}
                                title="Chọn tất cả"
                            />
                        </div>
                        <div className="header-col col-product">Sản phẩm</div>
                        <div className="header-col col-price">Đơn giá</div>
                        <div className="header-col col-qty">Số lượng</div>
                        <div className="header-col col-total">Thành tiền</div>
                        <div className="header-col col-action"></div>
                    </div>

                    <div className="cart-items-list">
                        {cartItems.length > 0 ? (
                            cartItems.map((item) => (
                                <ItemCart
                                    key={item.id}
                                    item={{ ...item, selected: selectedItems.includes(item.id), onSelect: handleSelectItem }}
                                    onUpdateQuantity={handleUpdateQuantity}
                                    onRemove={handleRemoveRequest}
                                    onChangeVariant={handleChangeVariant}
                                    onChangeColor={handleChangeColor}
                                />
                            ))
                        ) : (
                            <p className="no-products" style={{ minHeight: "200px" }}>Giỏ hàng của bạn đang trống</p>
                        )}
                    </div>
                </div>

                <div className="cart-summary-section">
                    <div className="cart-summary-box">
                        <h3>Tóm tắt đơn hàng</h3>
                        <div className="summary-row">
                            <span>Tạm tính ({selectedItems.length} sản phẩm)</span>
                            <span>{formatCurrency(totalPrice)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Phí giao hàng</span>
                            <span>Miễn phí</span>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-row total-row">
                            <span>Tổng cộng</span>
                            <span className="total-price">{formatCurrency(totalPrice)}</span>
                        </div>
                        <p className="vat-note">(Đã bao gồm VAT nếu có)</p>

                        <button
                            className="checkout-btn"
                            disabled={selectedItems.length === 0}
                            onClick={handleCheckoutClick}
                        >
                            Tiến hành thanh toán
                        </button>
                        <button className="continue-shopping-btn" onClick={() => navigate("/")}>Tiếp tục mua sắm</button>
                    </div>
                </div>
            </div>

            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Xác nhận xóa</h3>
                        <p>Bạn có chắc chắn muốn xóa <strong>{itemToDelete?.product_name}</strong> khỏi giỏ hàng?</p>
                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={() => { setShowDeleteModal(false); setItemToDelete(null); }}>Hủy</button>
                            <button className="confirm-logout-btn" onClick={handleConfirmDelete}>Xóa ngay</button>
                        </div>
                    </div>
                </div>
            )}

            {showCheckoutModal && (
                <div className="modal-overlay">
                    <div className="modal-content checkout-modal">
                        <div className="checkout-modal-header">
                            <div>
                                <h3>Thanh toán đơn hàng</h3>
                                <p>Chọn địa chỉ nhận hàng và hình thức thanh toán phù hợp.</p>
                            </div>
                            <button className="checkout-close-btn" onClick={() => setShowCheckoutModal(false)}>x</button>
                        </div>

                        <div className="checkout-address-bar">
                            <div className="checkout-address-main">
                                <label>Địa chỉ nhận hàng</label>
                                {addressesLoading ? (
                                    <div className="checkout-address-placeholder">Đang tải địa chỉ...</div>
                                ) : addresses.length > 0 ? (
                                    <select value={selectedAddressId} onChange={(event) => setSelectedAddressId(event.target.value)}>
                                        {addresses.map((address) => (
                                            <option key={address.id} value={address.id}>
                                                {address.full_name} - {address.phone} - {address.address}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <div className="checkout-address-placeholder">Bạn chưa có địa chỉ nhận hàng.</div>
                                )}
                            </div>
                            <button className="checkout-add-address-btn" onClick={() => navigate("/profile?tab=addresses")}>
                                + Thêm địa chỉ
                            </button>
                        </div>

                        {selectedAddress && (
                            <div className="checkout-address-preview">
                                <strong>{selectedAddress.full_name}</strong>
                                <span>{selectedAddress.phone}</span>
                                <p>{selectedAddress.address}</p>
                            </div>
                        )}

                        <div className="checkout-production-grid">
                            <aside className="checkout-method-menu">
                                <h4>Hình thức thanh toán</h4>
                                {paymentMethods.map((method) => (
                                    <button
                                        key={method.id}
                                        className={`checkout-method-btn ${paymentMethod === method.id ? "active" : ""}`}
                                        onClick={() => setPaymentMethod(method.id)}
                                    >
                                        <span>{method.label}</span>
                                        <small>{method.description}</small>
                                    </button>
                                ))}
                            </aside>

                            <section className="checkout-payment-panel">
                                <div className="checkout-panel-title">
                                    <h4>{selectedPayment.label}</h4>
                                    <span>{selectedPayment.description}</span>
                                </div>

                                {paymentMethod === "vietqr" && (
                                    <div className="vietqr-payment">
                                        <div className="vietqr-brand-row">
                                            <div className="vietqr-logo-mark">QR</div>
                                            <div>
                                                <strong>VietQR</strong>
                                                <span>Quét mã để chuyển khoản nhanh</span>
                                            </div>
                                        </div>

                                        <div className="vietqr-payment-grid">
                                            <div className="vietqr-code-card">
                                                <div className="vietqr-code-box">
                                                    <span>VIETQR</span>
                                                    <small>QR động</small>
                                                    <strong>{orderCode}</strong>
                                                </div>
                                                <p>Mở app ngân hàng → Quét QR → Xác nhận thanh toán</p>
                                            </div>

                                            <div className="vietqr-info-card">
                                                <div className="vietqr-info-row">
                                                    <span>Người nhận</span>
                                                    <strong>CÔNG TY TNHH FUJIFILM VIỆT NAM</strong>
                                                </div>
                                                <div className="vietqr-info-row">
                                                    <span>Số tài khoản</span>
                                                    <strong>007 100 125 1585</strong>
                                                </div>
                                                <div className="vietqr-info-row">
                                                    <span>Ngân hàng</span>
                                                    <strong>VIETCOMBANK - CN Hồ Chí Minh</strong>
                                                </div>
                                                <div className="vietqr-info-row highlight">
                                                    <span>Số tiền</span>
                                                    <strong>{formatCurrency(totalPrice)}</strong>
                                                </div>
                                                <div className="vietqr-info-row">
                                                    <span>Nội dung chuyển khoản</span>
                                                    <strong>{orderCode}</strong>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === "bank" && (
                                    <div className="bank-payment">
                                        <div className="bank-payment-title">
                                            <h5>Chuyển khoản ngân hàng</h5>
                                            <p>Vui lòng chuyển đúng số tiền và nội dung để đơn hàng được xác nhận nhanh.</p>
                                        </div>

                                        <div className="bank-info-card">
                                            <div className="bank-info-row">
                                                <span>Ngân hàng</span>
                                                <strong>VIETCOMBANK - CN Hồ Chí Minh</strong>
                                            </div>
                                            <div className="bank-info-row with-action">
                                                <span>Số tài khoản</span>
                                                <strong>007 100 125 1585</strong>
                                                <button onClick={() => copyText("0071001251585")}>Sao chép STK</button>
                                            </div>
                                            <div className="bank-info-row">
                                                <span>Chủ tài khoản</span>
                                                <strong>CÔNG TY TNHH FUJIFILM VIỆT NAM</strong>
                                            </div>
                                            <div className="bank-info-row highlight">
                                                <span>Số tiền cần chuyển</span>
                                                <strong>{formatCurrency(totalPrice)}</strong>
                                            </div>
                                            <div className="bank-info-row with-action">
                                                <span>Nội dung chuyển khoản</span>
                                                <strong>{orderCode}</strong>
                                                <button onClick={() => copyText(orderCode)}>Sao chép nội dung CK</button>
                                            </div>
                                        </div>

                                        <div className="bank-payment-guide">
                                            Mã đơn hàng <strong>{orderCode}</strong> là bắt buộc trong nội dung chuyển khoản.
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === "atm" && (
                                    <div className="domestic-card-payment">
                                        <div className="domestic-card-title">
                                            <div className="napas-logo-mark">NAPAS</div>
                                            <div>
                                                <h5>Thẻ ATM nội địa / Napas</h5>
                                                <p>Thanh toán bằng thẻ ATM của ngân hàng nội địa qua cổng Napas.</p>
                                            </div>
                                        </div>

                                        <div className="domestic-bank-list">
                                            {["Vietcombank", "BIDV", "Agribank", "Techcombank", "VietinBank", "ACB", "MB Bank", "Sacombank"].map(bank => (
                                                <button
                                                    key={bank}
                                                    className={selectedDomesticBank === bank ? "active" : ""}
                                                    onClick={() => setSelectedDomesticBank(bank)}
                                                >
                                                    {bank}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="domestic-card-form">
                                            <label>
                                                Số thẻ
                                                <input type="text" inputMode="numeric" placeholder="9704 0000 0000 0000" required />
                                            </label>
                                            <label>
                                                Tên chủ thẻ
                                                <input type="text" placeholder="NGUYEN VAN A" required />
                                            </label>
                                            <label>
                                                Ngày hiệu lực
                                                <input type="text" placeholder="MM/YY" required />
                                            </label>
                                        </div>

                                        <div className="checkout-method-message">
                                            Ngân hàng đã chọn: <strong>{selectedDomesticBank}</strong>. Số tiền cần thanh toán: <strong>{formatCurrency(totalPrice)}</strong>.
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === "visa" && (
                                    <div className="international-card-payment">
                                        <div className="international-card-title">
                                            <div className="card-brand-logos">
                                                <span className="visa-logo">VISA</span>
                                                <span className="mastercard-logo">MC</span>
                                            </div>
                                            <div>
                                                <h5>Thẻ quốc tế Visa/MasterCard</h5>
                                                <p>Thanh toán bằng thẻ quốc tế qua cổng thanh toán bảo mật.</p>
                                            </div>
                                        </div>

                                        <div className="international-card-form">
                                            <label>
                                                Số thẻ
                                                <input type="text" inputMode="numeric" placeholder="4111 1111 1111 1111" required />
                                            </label>
                                            <label>
                                                Tên chủ thẻ
                                                <input type="text" placeholder="NGUYEN VAN A" required />
                                            </label>
                                            <label>
                                                Ngày hết hạn
                                                <input type="text" placeholder="MM/YY" required />
                                            </label>
                                            <label>
                                                CVV
                                                <input type="password" inputMode="numeric" placeholder="123" maxLength="4" required />
                                            </label>
                                        </div>

                                        <div className="checkout-method-message">
                                            Số tiền cần thanh toán: <strong>{formatCurrency(totalPrice)}</strong>.
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === "cod" && (
                                    <div className="cod-payment">
                                        <div className="cod-payment-title">
                                            <div className="cod-icon-mark">COD</div>
                                            <div>
                                                <h5>Thanh toán khi nhận hàng</h5>
                                                <p>Tiền mặt / shipper / COD</p>
                                            </div>
                                        </div>

                                        <div className="cod-amount-box">
                                            <span>Số tiền cần trả</span>
                                            <strong>{formatCurrency(totalPrice)}</strong>
                                        </div>

                                        <div className="cod-note">
                                            Thanh toán cho nhân viên giao hàng khi nhận hàng.
                                        </div>
                                    </div>
                                )}

                                <div className="checkout-total-row">
                                    <span>Tổng thanh toán</span>
                                    <strong>{formatCurrency(totalPrice)}</strong>
                                </div>
                            </section>

                            <aside className="checkout-products-panel">
                                <h4>Sản phẩm đã chọn</h4>
                                <div className="checkout-selected-list">
                                    {selectedCartItems.map((item) => (
                                        <div className="checkout-selected-item" key={item.id}>
                                            <img src={item.product_image || "/testItem.png"} alt={item.product_name} />
                                            <div className="checkout-item-info">
                                                <strong>{item.product_name}</strong>
                                                <span>
                                                    {item.variant?.name || item.variant_name || "Phiên bản mặc định"}
                                                    {item.color_name ? ` - ${item.color_name}` : ""}
                                                </span>
                                                <span>Số lượng: {item.quantity || 1}</span>
                                            </div>
                                            <div className="checkout-item-price">{formatCurrency(item.subtotal)}</div>
                                        </div>
                                    ))}
                                </div>
                            </aside>
                        </div>

                        <div className="modal-actions checkout-actions">
                            <button className="cancel-btn" onClick={() => setShowCheckoutModal(false)}>Đóng</button>
                            {checkoutError && <p className="checkout-error">{checkoutError}</p>}
                            <button
                                className="confirm-payment-btn"
                                disabled={checkoutSubmitting}
                                onClick={handleConfirmCheckout}
                            >
                                {checkoutSubmitting ? "Đang tạo đơn..." : "Xác nhận thanh toán"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function BankTransferInfo({ totalPrice }) {
    return (
        <div className="payment-bank-grid">
            <span>Ngân hàng</span>
            <strong>VIETCOMBANK - CN Hồ Chí Minh</strong>
            <span>Số tài khoản</span>
            <strong>007 100 125 1585</strong>
            <span>Chủ tài khoản</span>
            <strong>CÔNG TY TNHH FUJIFILM VIỆT NAM</strong>
            {totalPrice && (
                <>
                    <span>Số tiền</span>
                    <strong>{totalPrice}</strong>
                </>
            )}
            <span>Nội dung</span>
            <strong>Họ tên - SĐT - Tên sản phẩm đặt mua</strong>
        </div>
    );
}

export default Cart;
