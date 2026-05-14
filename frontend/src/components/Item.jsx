import { Link } from "react-router-dom";
import "./Item.css"

function Item({ product }) {
    if (!product) return null;

    const imageUrl = product.thumbnail || "/testItem.png";

    const formatPrice = (price) => (
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(price))
    );

    const minPrice = product.min_price || product.base_price;
    const maxPrice = product.max_price || product.base_price;
    const formattedPrice = minPrice
        ? Number(minPrice) === Number(maxPrice)
            ? formatPrice(minPrice)
            : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
        : "Liên hệ";

    return (
        <Link to={`/product/${product.id}`} className="item-link">
            <div className="item">
                <img src={imageUrl} alt={product.name} />
                <p className="name">{product.name}</p>
                <p className="price">{formattedPrice}</p>
            </div>
        </Link>
    );
}

export default Item;
