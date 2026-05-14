import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import "./ItemCart.css"
import { apiPath, cachedJsonFetch, cacheTtl } from "../utils/api"

function ItemCart({ item, onUpdateQuantity, onRemove, onChangeVariant, onChangeColor }) {
    const [variants, setVariants] = useState([]);
    const [colors, setColors] = useState([]);

    // Fetch available variants/colors for this product
    useEffect(() => {
        if (!item.product_id) return;
        const fetchOptions = async () => {
            try {
                const data = await cachedJsonFetch(apiPath(`/products/${item.product_id}/`), {
                    cacheKey: `product:${item.product_id}`,
                    ttl: cacheTtl.long,
                });
                setVariants(data.variants || []);
                setColors(data.colors || []);
            } catch (err) {
                console.error("Error fetching product options:", err);
            }
        };
        fetchOptions();
    }, [item.product_id]);

    const currentVariantId = item.variant?.id || item.variant_id;
    const currentColorId = item.color_id || null;

    return (
        <div className="item-cart">
            <div className="item-cart-checkbox">
                <input type="checkbox" checked={item.selected} onChange={() => item.onSelect(item.id)} className="cart-checkbox" />
            </div>

            <div className="item-cart-product">
                <Link to={`/product/${item.product_id}`} className="item-cart-image-link">
                    <div className="item-cart-image">
                        <img src={item.product_image || "/testItem.png"} alt={item.product_name} />
                    </div>
                </Link>

                <div className="item-cart-info">
                    <Link to={`/product/${item.product_id}`} className="item-cart-name-link">
                        <h4 className="item-cart-name">{item.product_name || "Sản phẩm mẫu"}</h4>
                    </Link>

                    {/* Variant & Color selectors */}
                    <div className="item-cart-options">
                        {variants.length > 0 && (
                            <div className="option-select-group">
                                <label>Phiên bản:</label>
                                <select
                                    value={currentVariantId || ""}
                                    onChange={(e) => onChangeVariant && onChangeVariant(item.id, parseInt(e.target.value), variants)}
                                >
                                    {variants.map(v => (
                                        <option key={v.id} value={v.id}>{v.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        {colors.length > 0 && (
                            <div className="option-select-group">
                                <label>Màu:</label>
                                <select
                                    value={currentColorId || ""}
                                    onChange={(e) => onChangeColor && onChangeColor(item.id, parseInt(e.target.value), colors)}
                                >
                                    {colors.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="item-cart-unit-price">
                <p>{item.variant?.price ? parseInt(item.variant.price).toLocaleString() : "0"}đ</p>
            </div>
            <div className="item-cart-qty-wrapper">
                <div className="item-cart-quantity">
                    <button className="qty-btn" onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                    <input type="text" value={item.quantity || 1} readOnly className="qty-input" />
                    <button className="qty-btn" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
            </div>
            <div className="item-cart-total">
                <p>{parseInt(item.subtotal).toLocaleString()}đ</p>
            </div>
            <div className="item-cart-action">
                <button className="remove-btn" onClick={() => onRemove(item)}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ef4444"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                </button>
            </div>
        </div>
    )
}

export default ItemCart;
