import { Navigate, useParams } from "react-router-dom";
import "./InfoPage.css";

const pageData = {
    "ve-chung-toi": {
        title: "Về chúng tôi",
        intro: "Fujifilm là tập đoàn đa quốc gia đến từ Nhật Bản, khởi đầu từ lĩnh vực phim ảnh và phát triển thành doanh nghiệp đổi mới trong các lĩnh vực hình ảnh, y tế và vật liệu.",
        sections: [
            {
                heading: "Về tập đoàn Fujifilm",
                image: "/fujifilm_comp.jpg",
                body: [
                    "Được thành lập năm 1934 với tư cách là nhà sản xuất phim ảnh, Fujifilm đã mở rộng và phát triển trong hơn 80 năm để trở thành một doanh nghiệp hàng đầu về đổi mới với slogan “Value from innovation”.",
                    "Tập đoàn Fujifilm Holdings Corporation có trụ sở chính tại Tokyo, Nhật Bản. Ngoài lĩnh vực phim ảnh, Fujifilm hoạt động trong ba mảng chính: Giải pháp Y tế, Vật liệu và Hình ảnh.",
                ],
            },
            {
                heading: "Sứ mệnh đổi mới",
                body: [
                    "Fujifilm sử dụng các công nghệ độc quyền để cung cấp sản phẩm và dịch vụ chất lượng, đóng góp cho văn hóa, khoa học, công nghệ, công nghiệp, sức khỏe và môi trường sống.",
                    "Tinh thần không ngừng đổi mới giúp Fujifilm tạo ra các công nghệ, sản phẩm và dịch vụ mới nhằm truyền cảm hứng, mở rộng tiềm năng sáng tạo và đáp ứng nhu cầu của khách hàng trên toàn cầu.",
                ],
            },
            {
                heading: "Fujifilm Việt Nam",
                image: "/fujifilmvn.webp",
                body: [
                    "FUJIFILM Việt Nam là công ty con thuộc sở hữu hoàn toàn của FUJIFILM Asia Pacific Pte. Ltd., Singapore, hoạt động với danh mục sản phẩm đa dạng liên quan đến hình ảnh, máy chụp hình kỹ thuật số, phương tiện lưu trữ dữ liệu, đồ họa và hệ thống y tế.",
                    "Với trung tâm dịch vụ, phân phối kho bãi và dịch vụ dự phòng kỹ thuật, Fujifilm Việt Nam nỗ lực đáp ứng nhu cầu thị trường và mang lại sự hài lòng tốt nhất cho khách hàng.",
                ],
            },
        ],
    },
    "chinh-sach-mua-hang": {
        title: "Chính sách mua hàng",
        intro: "Chính sách mua hàng quy định cách khách hàng lựa chọn sản phẩm, đặt hàng, xác nhận đơn hàng và thanh toán trên cửa hàng trực tuyến.",
        sections: [
            {
                heading: "Sản phẩm và thông tin hiển thị",
                body: [
                    "Hình ảnh sản phẩm trên cửa hàng trực tuyến mang tính minh họa. Fujifilm nỗ lực đảm bảo màu sắc, kích thước và chi tiết gần với thực tế nhất, tuy nhiên sản phẩm thực tế có thể khác đôi chút do điều kiện hiển thị hoặc bao bì đi kèm.",
                    "Giá, biến thể, màu sắc, mô tả và tình trạng sản phẩm cần được khách hàng kiểm tra kỹ trước khi gửi đơn đặt hàng.",
                ],
            },
            {
                heading: "Quy trình đặt hàng",
                body: [
                    "Khách hàng có thể chọn sản phẩm từ danh mục, sử dụng bộ lọc theo tiêu chí hoặc tìm nhanh bằng tên sản phẩm trong ô tìm kiếm.",
                    "Sau khi chọn sản phẩm, khách hàng có thể xem chi tiết, chọn phiên bản, màu sắc, số lượng và thêm vào giỏ hàng. Tại giỏ hàng, khách hàng có thể điều chỉnh số lượng, xóa sản phẩm, tiếp tục mua sắm hoặc tiến hành đặt hàng.",
                    "Khi thanh toán, khách hàng cần nhập đầy đủ và chính xác thông tin giao hàng, ghi chú bổ sung nếu có yêu cầu xuất hóa đơn hoặc yêu cầu đặc biệt.",
                ],
            },
            {
                heading: "Xác nhận và xử lý đơn hàng",
                body: [
                    "Sau khi đặt hàng thành công, hệ thống ghi nhận đơn hàng và gửi xác nhận đã nhận đơn đặt hàng. Xác nhận này chưa đồng nghĩa với việc đơn hàng đã được chính thức chấp nhận.",
                    "Hợp đồng mua bán chỉ được xác lập khi Fujifilm rà soát đơn hàng, kiểm tra hàng hóa trong kho và gửi thông báo giao sản phẩm cho khách hàng.",
                    "Fujifilm có quyền từ chối hoặc bảo lưu đơn hàng trong trường hợp sản phẩm không còn sẵn, có sai sót về giá hoặc mô tả, thông tin khách hàng không đáp ứng điều kiện, địa chỉ nhận hàng ngoài lãnh thổ Việt Nam hoặc phát sinh tình huống bất khả kháng.",
                ],
            },
            {
                heading: "Giá và thanh toán",
                body: [
                    "Giá sản phẩm được niêm yết trên website theo từng thời kỳ và đã bao gồm thuế GTGT. Giá và chi phí vận chuyển có thể thay đổi nhưng không áp dụng hồi tố với đơn hàng đã được Fujifilm gửi thông báo giao sản phẩm.",
                    "Phương thức thanh toán trực tuyến được chấp nhận là chuyển khoản ngân hàng. Khách hàng cần kiểm tra giá trị đơn hàng, chọn phương thức chuyển khoản và thực hiện giao dịch theo thông tin hiển thị trên trang thanh toán.",
                    "Thông tin nhận chuyển khoản: Số tài khoản 007 100 125 1585, tên tài khoản CÔNG TY TNHH FUJIFILM VIỆT NAM, ngân hàng VIETCOMBANK - CN Hồ Chí Minh. Nội dung thanh toán cần có thông tin người mua, số điện thoại và tên sản phẩm đặt mua.",
                ],
            },
        ],
    },
    "chinh-sach-giao-nhan": {
        title: "Chính sách giao nhận",
        intro: "Sản phẩm được giao theo hình thức nhận tại cửa hàng hoặc giao hàng tận nơi trong phạm vi áp dụng của Fujifilm.",
        sections: [
            {
                heading: "Phạm vi và hình thức giao hàng",
                body: [
                    "Đối với giao hàng tận nơi, phạm vi giao hàng áp dụng trong lãnh thổ Việt Nam. Đối với nhận tại cửa hàng, khách hàng nhận sản phẩm tại cửa hàng đã chọn trong danh sách được Fujifilm cung cấp.",
                    "Khi nhận hàng tại cửa hàng, khách hàng đồng ý cung cấp thông tin cần thiết để xác thực danh tính người mua như CCCD/CMND, số điện thoại đặt hàng, email hoặc tin nhắn xác nhận đơn hàng.",
                ],
            },
            {
                heading: "Liên hệ và theo dõi đơn hàng",
                body: [
                    "Sau khi sản phẩm được đóng gói và chuyển cho đơn vị vận chuyển, Fujifilm sẽ gửi email xác nhận kèm đường dẫn tra cứu tình trạng đơn hàng.",
                    "Trước khi giao sản phẩm, Fujifilm hoặc đơn vị vận chuyển sẽ liên hệ theo thông tin khách hàng đã đăng ký để xác nhận thời gian giao hàng.",
                ],
            },
            {
                heading: "Thời gian giao hàng",
                body: [
                    "Thời gian giao nhận sớm nhất từ 5 đến 7 ngày làm việc, không bao gồm Thứ Bảy, Chủ Nhật và ngày lễ, tính từ ngày khách hàng nhận được thông báo giao sản phẩm.",
                    "Thời gian giao hàng có thể thay đổi do điều kiện vận chuyển, quy định tại địa phương hoặc các tình huống ngoài khả năng kiểm soát. Nếu có nhu cầu đặc biệt, khách hàng nên liên hệ trước với Fujifilm.",
                ],
            },
            {
                heading: "Kiểm tra và ký nhận",
                body: [
                    "Khi nhận hàng, khách hàng cần kiểm tra tình trạng bao bì, sản phẩm, phụ kiện đi kèm và thông tin đơn hàng trước khi ký nhận.",
                    "Nếu phát hiện dấu hiệu bất thường, sai sản phẩm, thiếu sản phẩm hoặc hư hại trong quá trình vận chuyển, khách hàng cần liên hệ Fujifilm để được hỗ trợ xử lý.",
                ],
            },
        ],
    },
    "chinh-sach-hoan-tra": {
        title: "Chính sách trả hàng và hoàn tiền",
        intro: "Yêu cầu trả hàng và hoàn tiền được xem xét trong các trường hợp sản phẩm không đúng cam kết, bị lỗi, hư hại hoặc giao sai.",
        sections: [
            {
                heading: "Trường hợp được yêu cầu trả hàng",
                body: [
                    "Khách hàng có thể yêu cầu trả hàng và hoàn tiền nếu đã thanh toán nhưng không nhận được sản phẩm, không nhận đủ sản phẩm, nhận hàng giả/hàng nhái, sản phẩm bị lỗi hoặc hư hại trong vận chuyển.",
                    "Yêu cầu cũng được xem xét nếu Fujifilm giao sai sản phẩm như sai loại, sai màu sắc hoặc sản phẩm nhận được khác biệt rõ rệt so với thông tin mô tả.",
                ],
            },
            {
                heading: "Thời hạn và cách gửi yêu cầu",
                body: [
                    "Khách hàng có thể gửi yêu cầu trả hàng/hoàn tiền trong vòng 03 ngày kể từ lúc đơn hàng được cập nhật giao hàng thành công.",
                    "Mọi yêu cầu cần gửi qua email và kèm bằng chứng bằng hình ảnh hoặc video để Fujifilm có cơ sở kiểm tra, đối chiếu và xử lý.",
                ],
            },
            {
                heading: "Điều kiện hàng trả lại",
                body: [
                    "Sản phẩm cần được đóng gói theo hiện trạng lúc nhận hàng, bao gồm toàn bộ phụ kiện đi kèm, hóa đơn VAT, tem phiếu bảo hành nếu có và phải còn nguyên vẹn.",
                    "Các trường hợp trả hàng do thay đổi ý định mua hàng sẽ không được chấp nhận, trừ khi được quy định khác trong chính sách này.",
                ],
            },
            {
                heading: "Hoàn tiền",
                body: [
                    "Fujifilm chỉ hoàn tiền sau khi đã nhận lại hàng và kiểm tra tình trạng hàng trả phù hợp với mô tả của khách hàng và điều kiện trả hàng.",
                    "Tiền hoàn trả sẽ được chuyển vào tài khoản ngân hàng hoặc tài khoản thẻ mà khách hàng đã dùng để mua hàng.",
                ],
            },
        ],
    },
    "chinh-sach-bao-hanh": {
        title: "Chính sách bảo hành",
        intro: "Chính sách bảo hành áp dụng cho sản phẩm Fujifilm được phân phối chính thức tại thị trường Việt Nam và có thể được cập nhật theo từng thời kỳ.",
        sections: [
            {
                heading: "Phạm vi áp dụng",
                body: [
                    "Chính sách bảo hành áp dụng cho máy ảnh kỹ thuật số, ống kính và phụ kiện máy ảnh Fujifilm được phân phối chính thức tại thị trường Việt Nam.",
                    "Các sản phẩm máy ảnh kỹ thuật số và ống kính Fujifilm mua từ ngày 01/10/2015 trở đi áp dụng bảo hành điện tử. Sản phẩm mua trước thời điểm này áp dụng theo thời gian và điều kiện in trên phiếu bảo hành giấy.",
                ],
            },
            {
                heading: "Thời hạn bảo hành",
                body: [
                    "Máy ảnh dòng X Series và GFX Series: bảo hành 24 tháng tại Việt Nam kể từ ngày mua nhưng không quá 27 tháng kể từ ngày xuất kho.",
                    "Ống kính rời Fujinon và ống kính rời GF: bảo hành 18 tháng tại Việt Nam kể từ ngày mua nhưng không quá 21 tháng kể từ ngày xuất kho.",
                    "Các dòng máy khác của Fujifilm: bảo hành 12 tháng tại Việt Nam kể từ ngày mua nhưng không quá 15 tháng kể từ ngày xuất kho.",
                    "Phụ kiện đi kèm hoặc phụ kiện mua thêm như pin, sạc, đèn flash, ngàm ống kính, dây bấm mềm: bảo hành miễn phí 3 tháng tại Việt Nam kể từ ngày mua nhưng không quá 6 tháng kể từ ngày xuất kho đối với pin và sạc đi theo máy.",
                ],
            },
            {
                heading: "Cập nhật chính sách",
                body: [
                    "Nội dung bảo hành có thể thay đổi theo danh sách sản phẩm và chính sách chung của Fujifilm Việt Nam. Khi có thay đổi, Fujifilm sẽ cập nhật nội dung điều khoản bảo hành trên kênh thông tin chính thức.",
                    "Thông tin chi tiết có thể tham khảo tại website Fujifilm Việt Nam: http://www.fujifilm-vietnam.com/.",
                ],
            },
        ],
    },
    "chinh-sach-bao-mat": {
        title: "Chính sách bảo mật và quyền riêng tư",
        intro: "Fujifilm tôn trọng quyền riêng tư của khách hàng và quản lý thông tin cá nhân theo mục đích rõ ràng, phù hợp với quy định pháp luật.",
        sections: [
            {
                heading: "Phạm vi áp dụng",
                body: [
                    "Chính sách bảo mật áp dụng đối với thông tin cá nhân do khách hàng cung cấp thông qua các website được quản lý và vận hành bởi Công ty TNHH FUJIFILM Việt Nam.",
                    "Trong trường hợp một trang hoặc dịch vụ riêng có quy định khác về thông tin cá nhân, quy định riêng đó sẽ được ưu tiên áp dụng.",
                ],
            },
            {
                heading: "Thông tin được thu thập",
                body: [
                    "Khách hàng có thể xem website mà không cần tiết lộ thông tin cá nhân. Tuy nhiên, khi đăng ký, gửi yêu cầu, nhận tin tức hoặc liên hệ dịch vụ khách hàng, Fujifilm có thể yêu cầu các thông tin như tên, địa chỉ, số điện thoại, email, ngày sinh, giới tính hoặc thông tin liên quan đến sản phẩm/dịch vụ.",
                    "Website cũng có thể thu thập thông tin về nội dung đã xem hoặc nguồn truy cập nhằm cải thiện khả năng sử dụng, nhưng không nhằm xác định danh tính cá nhân nếu không cần thiết.",
                ],
            },
            {
                heading: "Mục đích sử dụng",
                body: [
                    "Thông tin cá nhân được sử dụng để cung cấp dịch vụ khách hàng yêu cầu, liên hệ hỗ trợ, xử lý đơn hàng, phản hồi thắc mắc và cải thiện chất lượng dịch vụ.",
                    "Việc sử dụng thông tin được giới hạn trong mục đích đã thông báo cho khách hàng, trừ trường hợp được pháp luật cho phép hoặc yêu cầu.",
                ],
            },
            {
                heading: "Bảo vệ dữ liệu và cookie",
                body: [
                    "Fujifilm quản lý thông tin cá nhân bằng các biện pháp hợp lý nhằm ngăn chặn truy cập trái phép, mất mát, rò rỉ, chỉnh sửa hoặc sử dụng sai mục đích.",
                    "Website có thể sử dụng SSL, cookie và tệp chỉ báo để nâng cao trải nghiệm truy cập, phân tích hoạt động và cải thiện dịch vụ. Khách hàng có thể điều chỉnh cài đặt trình duyệt liên quan đến cookie.",
                ],
            },
            {
                heading: "Thay đổi và liên hệ",
                body: [
                    "Chính sách bảo mật có thể được cập nhật khi cần thiết. Các thay đổi sẽ được công bố trên website hoặc kênh thông tin phù hợp.",
                    "Mọi câu hỏi liên quan đến chính sách bảo mật có thể gửi đến Fujifilm Việt Nam qua thông tin liên hệ được công bố trên website.",
                ],
            },
        ],
    },
    "lien-he": {
        title: "Liên hệ",
        intro: "Khách hàng có thể liên hệ Fujifilm Việt Nam qua email, điện thoại hoặc ghé thăm địa chỉ văn phòng trong giờ làm việc.",
        sections: [
            {
                heading: "Chi nhánh Hồ Chí Minh",
                body: [
                    "Tầng G - Toà nhà The Hallmark - số 15 đường Trần Bạch Đằng, Phường Thủ Thiêm, Thành phố Thủ Đức, Thành phố Hồ Chí Minh.",
                    "Điện thoại: (028) 3939 0847 - Số máy lẻ: 250.",
                    "Email: kinhdoanh.fujifilmxspace.vn@gmail.com.",
                ],
            },
            {
                heading: "Giờ làm việc",
                body: [
                    "08:30 AM - 05:30 PM từ Thứ Hai đến Thứ Sáu.",
                    "09:00 AM - 12:00 PM và 01:00 PM - 04:00 PM vào Thứ Bảy, trừ ngày lễ.",
                ],
            },
            {
                heading: "Liên hệ doanh nghiệp",
                body: [
                    "FUJIFILM Vietnam Co., Ltd.",
                    "Email: communications_ffvn@fujifilm.com.",
                ],
            },
        ],
    },
    "dieu-khoan-dich-vu": {
        title: "Điều khoản và điều kiện sử dụng",
        intro: "Điều khoản sử dụng quy định quyền và nghĩa vụ của người dùng khi truy cập, duyệt, tìm kiếm và sử dụng website Fujifilm X-Space.",
        sections: [
            {
                heading: "Đơn vị vận hành",
                body: [
                    "Website được vận hành bởi Fujifilm Việt Nam, công ty thuộc sở hữu của FUJIFILM Châu Á Thái Bình Dương.",
                    "Việc truy cập và sử dụng website đồng nghĩa với việc người dùng đồng ý tuân thủ các điều khoản sử dụng, chính sách quyền riêng tư và chính sách cookie có liên quan.",
                ],
            },
            {
                heading: "Truy cập website",
                body: [
                    "Fujifilm không đảm bảo website hoặc mọi nội dung trên website luôn khả dụng hoặc không bị gián đoạn. Fujifilm có thể đình chỉ, thu hồi, ngừng hoặc thay đổi toàn bộ hay một phần website mà không cần thông báo trước.",
                    "Người dùng chịu trách nhiệm chuẩn bị điều kiện cần thiết để truy cập website, bao gồm kết nối internet và trình duyệt phù hợp.",
                ],
            },
            {
                heading: "Sử dụng hợp pháp",
                body: [
                    "Người dùng chỉ được sử dụng website cho các mục đích hợp pháp, không được vi phạm quyền của người dùng khác hoặc cản trở họ sử dụng website.",
                    "Nghiêm cấm sử dụng website để phát tán nội dung độc hại, tấn công hệ thống, truy cập trái phép hoặc quảng bá sản phẩm/dịch vụ khác khi chưa được Fujifilm chấp thuận.",
                ],
            },
            {
                heading: "Quyền sở hữu trí tuệ",
                body: [
                    "Logo FUJIFILM và các tài sản sở hữu trí tuệ liên quan được bảo hộ hợp pháp và thuộc quyền sở hữu của FUJIFILM Holdings Corporation hoặc các đơn vị được cấp quyền.",
                    "Người dùng không được sao chép, khai thác hoặc sử dụng nội dung website trái với điều khoản sử dụng hoặc quy định pháp luật.",
                ],
            },
            {
                heading: "Liên kết bên thứ ba và giới hạn trách nhiệm",
                body: [
                    "Website có thể chứa liên kết đến website hoặc tài nguyên do bên thứ ba vận hành. Các liên kết này chỉ nhằm mục đích tham khảo; Fujifilm không kiểm soát và không chịu trách nhiệm về nội dung, tính khả dụng hoặc thiệt hại phát sinh từ việc sử dụng các liên kết đó.",
                    "Trong phạm vi pháp luật cho phép, Fujifilm loại trừ các bảo đảm ngụ ý và không chịu trách nhiệm đối với tổn thất gián tiếp, ngẫu nhiên, đặc biệt hoặc hệ quả phát sinh từ việc sử dụng website.",
                ],
            },
            {
                heading: "Luật áp dụng",
                body: [
                    "Điều khoản sử dụng được điều chỉnh bởi pháp luật Việt Nam. Các tranh chấp hoặc khiếu nại phát sinh có thể thuộc thẩm quyền của Trung tâm Trọng tài Quốc tế Việt Nam (VIAC) hoặc Trung tâm Trọng tài Quốc tế Singapore (SIAC) theo quy định liên quan.",
                    "Fujifilm có quyền cập nhật nội dung điều khoản sử dụng và các thông báo liên quan theo từng thời kỳ.",
                ],
            },
        ],
    },
};

function InfoPage() {
    const { slug } = useParams();
    const page = pageData[slug];

    if (!page) return <Navigate to="/" replace />;

    return (
        <div className="info-page">
            <div className="info-page-inner">
                <h1>{page.title}</h1>
                <p className="info-page-intro">{page.intro}</p>
                <article className="info-page-content info-section">
                    {page.sections.map((section) => (
                        <section key={section.heading} className="info-subsection">
                            {section.image && (
                                <img className="info-section-image" src={section.image} alt={section.heading} />
                            )}
                            <div className="info-section-text">
                                <h2>{section.heading}</h2>
                                {section.body.map((paragraph) => (
                                    <p key={paragraph}>{paragraph}</p>
                                ))}
                            </div>
                        </section>
                    ))}
                </article>
            </div>
        </div>
    );
}

export default InfoPage;
