// Cấu hình filter động theo từng danh mục sản phẩm
const filterConfig = {
    gfx: {
        title: "GFX Series",
        slug: "gfx",
        filters: [
            {
                key: "kieu-dang",
                title: "Kiểu dáng",
                type: "checkbox",
                options: ["Mirrorless", "Medium Format"]
            },
            {
                key: "viewfinder",
                title: "Viewfinder",
                type: "checkbox",
                options: ["EVF", "EVF/OVF", "Không có viewfinder"]
            },
        ]
    },
    "x-series": {
        title: "X Series",
        slug: "x-series",
        filters: [
            {
                key: "kieu-dang",
                title: "Kiểu dáng",
                type: "checkbox",
                options: ["Mirrorless", "Compact", "Rangefinder"]
            },
            {
                key: "viewfinder",
                title: "Viewfinder",
                type: "checkbox",
                options: ["EVF", "EVF/OVF", "Không có viewfinder"]
            },
        ]
    },
    "ong-kinh": {
        title: "Ống kính",
        slug: "ong-kinh",
        filters: [
            {
                key: "ngam",
                title: "Ngàm",
                type: "checkbox",
                options: ["Ngàm GF", "Ngàm X"]
            },
            {
                key: "loai-zoom",
                title: "Loại",
                type: "checkbox",
                options: ["Zoom", "Fix (Prime)"]
            },
            {
                key: "tieu-cu",
                title: "Tiêu cự",
                type: "checkbox",
                options: ["Wide (< 24mm)", "Standard (24-70mm)", "Telephoto (> 70mm)", "Macro"]
            },
        ]
    },
    instax: {
        title: "INSTAX",
        slug: "instax",
        filters: [
            {
                key: "loai",
                title: "Loại sản phẩm",
                type: "checkbox",
                options: ["Máy chụp ảnh lấy ngay", "Film Instax", "Phụ kiện Instax"]
            },
            {
                key: "dong",
                title: "Dòng sản phẩm",
                type: "checkbox",
                options: ["Mini", "Square", "Wide"]
            },
        ]
    },
    film: {
        title: "FILM",
        slug: "film",
        filters: [
            {
                key: "loai-film",
                title: "Loại film",
                type: "checkbox",
                options: ["Film 35mm", "Film 120", "Film Instax"]
            },
            {
                key: "mau-sac",
                title: "Màu sắc",
                type: "checkbox",
                options: ["Màu (Color)", "Đen trắng (B&W)", "Slide (Reversal)"]
            },
        ]
    },
    "phu-kien": {
        title: "Phụ kiện",
        slug: "phu-kien",
        filters: [
            {
                key: "loai-phu-kien",
                title: "Loại phụ kiện",
                type: "checkbox",
                options: ["Thẻ nhớ", "Filter", "Bao da", "Pin & Sạc", "Dây đeo", "Khác"]
            },
            {
                key: "tuong-thich",
                title: "Tương thích",
                type: "checkbox",
                options: ["GFX Series", "X Series", "INSTAX", "Tất cả"]
            },
        ]
    },
    "search": {
        title: "Kết quả tìm kiếm",
        slug: "search",
        filters: [
            {
                key: "type",
                title: "Loại sản phẩm",
                type: "checkbox",
                options: ["Camera", "Lens", "Film", "Instax", "Accessories"]
            },
            {
                key: "kieu-dang",
                title: "Kiểu dáng",
                type: "checkbox",
                options: ["Mirrorless", "Medium Format", "Compact", "Rangefinder"]
            },
            {
                key: "viewfinder",
                title: "Viewfinder",
                type: "checkbox",
                options: ["EVF", "EVF/OVF", "Không có viewfinder"]
            },
            {
                key: "ngam",
                title: "Ngàm ống kính",
                type: "checkbox",
                options: ["Ngàm GF", "Ngàm X"]
            },
            {
                key: "loai-zoom",
                title: "Loại ống kính",
                type: "checkbox",
                options: ["Zoom", "Fix (Prime)"]
            },
            {
                key: "loai-phu-kien",
                title: "Loại phụ kiện",
                type: "checkbox",
                options: ["Thẻ nhớ", "Filter", "Bao da", "Pin & Sạc", "Dây đeo", "Khác"]
            }
        ]
    }
};

export default filterConfig;
