import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { apiPath, cachedJsonFetch, cacheTtl } from '../utils/api';

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

function ProductShow4() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewestProducts = async () => {
      try {
        const data = await cachedJsonFetch(apiPath('/products/'), {
          cacheKey: 'home:newest-products',
          ttl: cacheTtl.medium,
        });
        setProducts(data.results || []);
      } catch (error) {
        console.error("Error fetching newest products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNewestProducts();
  }, []);

  if (loading) return <div className="loading">Đang tải...</div>;

  if (products.length === 0) {
    return <div className="no-products">Không có sản phẩm hiển thị</div>;
  }

  return (
    <div className="product-show4">
      <Swiper
        className="product-show4-swiper"
        modules={[Navigation]}
        loop={products.length > 4}
        navigation={true}
        spaceBetween={20}
        slidesPerView={4}
        breakpoints={{
          0: { slidesPerView: 1.2, spaceBetween: 12 },
          576: { slidesPerView: 2, spaceBetween: 16 },
          900: { slidesPerView: 3, spaceBetween: 18 },
          1100: { slidesPerView: 4, spaceBetween: 20 },
        }}
      >
        {products.map((p) => (
          <SwiperSlide key={p.id}>
            <Link to={`/product/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card product-show4-card">
                <img src={p.thumbnail || "/p1.jpg"} className="card-img-top" alt={p.name} />
                <div className="card-body">
                  <h5 className="card-title text-truncate">{p.name}</h5>
                  <p className="card-text text-danger fw-bold">{formatProductPrice(p)}</p>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default ProductShow4;
