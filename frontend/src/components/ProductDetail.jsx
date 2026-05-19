import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import './ProductDetail.css';
import { addToGuestCart } from '../utils/cartUtils';
import { apiPath, cachedJsonFetch, cacheTtl } from '../utils/api';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // States cho việc chọn options
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({ type: "success", message: "" });

  useEffect(() => {
    const fetchProductDetail = async () => {
      setLoading(true);
      try {
        const data = await cachedJsonFetch(apiPath(`/products/${id}/`), {
          cacheKey: `product:${id}`,
          ttl: cacheTtl.long,
        });
        setProduct(data);
        
        // Mặc định chọn màu và variant đầu tiên
        if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0].id);
        if (data.variants && data.variants.length > 0) setSelectedVariant(data.variants[0].id);
      } catch (error) {
        console.error("Error fetching product detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetail();
  }, [id]);

  if (loading) return <div className="loading">Đang tải chi tiết sản phẩm...</div>;
  if (!product) return <div className="error">Không tìm thấy sản phẩm.</div>;

  // Lấy ra giá của variant đang được chọn
  const currentVariant = product.variants.find(v => v.id === selectedVariant) || product.variants[0];
  const currentPrice = currentVariant ? currentVariant.price : 0;
  const selectedColorObj = product.colors?.find(color => color.id === selectedColor) || product.colors?.[0];

  const openModal = (type, message) => {
    setModalInfo({ type, message });
    setShowModal(true);
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      openModal("error", "Vui lòng chọn phiên bản sản phẩm.");
      return;
    }

    const token = localStorage.getItem("access");
    const thumbnail = product.images?.[0]?.image_url || "/testItem.png";

    if (!token) {
      // ── Guest: lưu vào localStorage ──
      addToGuestCart({
        variant_id: selectedVariant,
        color_id: selectedColor,
        quantity: 1,
        productInfo: {
          product_id: product.id,
          product_name: product.name,
          product_image: thumbnail,
          variant_name: currentVariant.name,
          variant_price: currentPrice,
          color_name: selectedColorObj?.name || null,
          color_hex: selectedColorObj?.hex_code || null,
        }
      });
      openModal("success", "Đã thêm sản phẩm vào giỏ hàng!");
      return;
    }

    // ── Logged-in: gọi API ──
    try {
      const response = await fetch(apiPath("/cart/add/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          variant_id: selectedVariant,
          quantity: 1
        })
      });

      if (response.ok) {
        window.dispatchEvent(new Event("cart:changed"));
        openModal("success", "Đã thêm sản phẩm vào giỏ hàng!");
      } else {
        const errorData = await response.json();
        openModal("error", errorData.detail || "Không thể thêm vào giỏ hàng.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      openModal("error", "Đã xảy ra lỗi khi kết nối với máy chủ.");
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate("/cart");
  };

  return (
    <div className="product-detail-container">
      <div className="container pd-inner-container">
        
        {/* Phần Top */}
        <div className="pd-top">
          
          {/* Left: Ảnh + Specs */}
          <div className="pd-left">
            <div className="pd-gallery">
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                spaceBetween={20}
                slidesPerView={1}
                className="pd-swiper"
              >
                {product.images && product.images.length > 0 ? (
                  product.images.map((img, idx) => (
                    <SwiperSlide key={idx}>
                      <div className="img-wrapper">
                        <img src={img.image_url} alt={`${product.name} ${idx + 1}`} />
                      </div>
                    </SwiperSlide>
                  ))
                ) : (
                  <SwiperSlide>
                    <div className="img-wrapper">
                      <img src="/testItem.png" alt="No image" />
                    </div>
                  </SwiperSlide>
                )}
              </Swiper>
            </div>
            
            <div className="pd-specs">
              <h3>Thông số kỹ thuật</h3>
              {product.specs ? Object.entries(product.specs).map(([group, attrs]) => (
                <div key={group} className="spec-group">
                  <h4 className="spec-group-title">{group}</h4>
                  <ul>
                    {attrs.map((attr, idx) => (
                      <li key={idx}><strong>{attr.name}:</strong> {attr.value}</li>
                    ))}
                  </ul>
                </div>
              )) : <p>Chưa có thông số kỹ thuật.</p>}
            </div>
          </div>

          {/* Right: Options + Buttons */}
          <div className="pd-right">
            <h1 className="pd-title">{product.name}</h1>
            <div className="pd-price">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentPrice)}
            </div>

            {product.colors && product.colors.length > 0 && (
              <div className="pd-option-group">
                <h4 className="option-label">Màu sắc</h4>
                {selectedColorObj?.name && (
                  <div className="selected-color-name">{selectedColorObj.name}</div>
                )}
                <div className="color-options">
                  {product.colors.map(color => (
                    <div 
                      key={color.id} 
                      className={`color-btn ${selectedColor === color.id ? 'active' : ''}`}
                      onClick={() => setSelectedColor(color.id)}
                      title={color.name}
                    >
                      <div className="color-swatch" style={{ backgroundColor: color.hex_code }}></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {product.variants && product.variants.length > 0 && (
              <div className="pd-option-group">
                <h4 className="option-label">Tùy chọn phiên bản</h4>
                <div className="variant-options">
                  {product.variants.map(variant => (
                    <div 
                      key={variant.id}
                      className={`variant-btn ${selectedVariant === variant.id ? 'active' : ''}`}
                      onClick={() => setSelectedVariant(variant.id)}
                    >
                      {variant.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pd-actions">
              <button className="btn-add-cart" onClick={handleAddToCart}>THÊM VÀO GIỎ HÀNG</button>
              <button className="btn-buy-now" onClick={handleBuyNow}>MUA NGAY</button>
            </div>
          </div>
          
        </div>

        {/* Phần Bottom: Description */}
        <div className="pd-bottom">
          <div className="pd-description">
            <h2>Đặc điểm nổi bật</h2>
            <div className="desc-content" dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>
        </div>
        
      </div>

      {/* Modal thông báo */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{modalInfo.type === "success" ? "🎉 Thành công" : "⚠️ Thông báo"}</h3>
            <p>{modalInfo.message}</p>
            <div className="modal-actions">
              {modalInfo.type === "success" ? (
                <>
                  <button className="cancel-btn" onClick={() => setShowModal(false)}>Tiếp tục mua</button>
                  <button className="confirm-logout-btn" style={{background: "#07b446"}} onClick={() => navigate("/cart")}>Đi đến giỏ hàng</button>
                </>
              ) : (
                <button className="cancel-btn" onClick={() => setShowModal(false)}>Đóng</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
