import "./Body.css";
import ProductShow4 from "./ProductShow4";

function Body() {
  return (
    <div className="body">
      <div className="body-container">
        <div id="carouselExampleAutoplaying" className="carousel slide body-poster" data-bs-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="/post1.jpg" className="d-block w-100" alt="FUJIFILM banner" />
            </div>
            <div className="carousel-item">
              <img src="/post2.png" className="d-block w-100" alt="Camera promotion" />
            </div>
            <div className="carousel-item">
              <img src="/post2.png" className="d-block w-100" alt="Camera collection" />
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleAutoplaying"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleAutoplaying"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>

        <section className="body-section">
          <h2>Sản phẩm mới</h2>
          <ProductShow4 />
        </section>

        <div className="body-video">
          <iframe
            src="https://www.youtube.com/embed/NaL-GfOHmVo?si=bNW4u2klLyxc74P9&amp;start=7"
            title="YouTube video player"
            frameBorder="0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default Body;
