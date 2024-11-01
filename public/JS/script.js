const tableCart = document.querySelector("[table-cart]");
if (tableCart) {
    const dataRecord = tableCart.querySelectorAll("[data-record]");
    dataRecord.forEach((record) => {
        const increaseQuantity = record.querySelectorAll(".increase");
        const decreaseQuantity = record.querySelectorAll(".decrease");
        let valueQuantity = parseInt(
            record.querySelector(".input-quantity").value
        );
        //Value min/max
        const max = parseInt(
            record.querySelector(".input-quantity").getAttribute("max")
        );
        const min = parseInt(
            record.querySelector(".input-quantity").getAttribute("min")
        );

        //Event button increase
        increaseQuantity.forEach((item) => {
            item.addEventListener("click", () => {
                if (valueQuantity < max) {
                    valueQuantity++;
                    record
                        .querySelector("input[name=quantity]")
                        .setAttribute("value", valueQuantity);
                    const id = record
                        .querySelector("input[name=quantity]")
                        .getAttribute("item-id");
                    const color = record
                        .querySelector("input[name=quantity]")
                        .getAttribute("color");
                    const quantity = record.querySelector(
                        "input[name=quantity]"
                    ).value;
                    if (color) {
                        window.location.href = `/cart/update/${id}/${color}/${quantity}`;
                    } else {
                        window.location.href = `/cart/update/${id}/${quantity}`;
                    }
                } else {
                    alert(`Số lượng mua tối đa của sản phẩm này là ${max}`);
                }
            });
        });
        //Event button decrease
        decreaseQuantity.forEach((item) => {
            item.addEventListener("click", () => {
                if (valueQuantity > min) {
                    valueQuantity--;
                    record
                        .querySelector("input[name=quantity]")
                        .setAttribute("value", valueQuantity);
                    const id = record
                        .querySelector("input[name=quantity]")
                        .getAttribute("item-id");
                    const color = record
                        .querySelector("input[name=quantity]")
                        .getAttribute("color");
                    const quantity = record.querySelector(
                        "input[name=quantity]"
                    ).value;
                    if (color) {
                        window.location.href = `/cart/update/${id}/${color}/${quantity}`;
                    } else {
                        window.location.href = `/cart/update/${id}/${quantity}`;
                    }
                } else {
                    record.querySelector(".input-quantity").value = min;
                    const id = record
                        .querySelector("input[name=quantity]")
                        .getAttribute("item-id");
                    const color = record
                        .querySelector("input[name=quantity]")
                        .getAttribute("color");
                    const quantity = record.querySelector(
                        "input[name=quantity]"
                    ).value;
                    if (color) {
                        window.location.href = `/cart/update/${id}/${color}/${quantity}`;
                    } else {
                        window.location.href = `/cart/update/${id}/${quantity}`;
                    }
                }
            });
        });
    });
}

// show-alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
    let time = showAlert.getAttribute("data-time");
    time = parseInt(time);

    // Sau time giây sẽ đóng thông báo
    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, time);

    // Khi click vào nút close-alert sẽ đóng luôn
    const closeAlert = showAlert.querySelector("[close-alert]");
    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    });
}
// End show-alert

const formLogin = document.querySelector("[form-login]");
if (formLogin) {
    formLogin.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = formLogin.querySelector("#email").value;
        const password = formLogin.querySelector("#password").value;
        if (email == "") {
            alert("Vui lòng nhập email!");
            return;
        }
        if (password == "") {
            alert("Vui lòng nhập mật khẩu!");
            return;
        }
        formLogin.submit();
    });
}

const formRegister = document.querySelector("[form-register]");
if (formRegister) {
    formRegister.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = formRegister.querySelector("#email").value;
        const fullName = formRegister.querySelector("#fullName").value;
        const password = formRegister.querySelector("#password").value;
        if (fullName == "") {
            alert("Vui lòng nhập họ tên!");
            return;
        }
        if (email == "") {
            alert("Vui lòng nhập email!");
            return;
        }
        if (password == "") {
            alert("Vui lòng nhập mật khẩu!");
            return;
        }
        formRegister.submit();
    });
}

//Check stock product
const formAddCart = document.querySelector("[form-add-cart]");
if (formAddCart) {
    const valueInitial = parseInt(
        formAddCart.querySelector("[input-stock]").value
    );
    const color = document.querySelectorAll("[color-choosed]");
    const colorCart = formAddCart.querySelector("[color-cart]");
    color.forEach((item) => {
        item.addEventListener("click", () => {
            color.forEach((element) => {
                element.classList.remove("active");
            });
            item.classList.add("active");
            colorCart.setAttribute("value", item.getAttribute("value"));
        });
    });

    formAddCart.addEventListener("submit", (e) => {
        e.preventDefault();
        const value = parseInt(
            formAddCart.querySelector("[input-stock]").value
        );
        if (colorCart) {
            if (!colorCart.getAttribute("value")) {
                alert("Vui lòng chọn màu cho sản phẩm!");
            } else {
                if (value > valueInitial) {
                    alert("Số lượng sản phẩm vượt quá giới hạn!");
                } else {
                    formAddCart.submit();
                }
            }
        } else {
            if (value > valueInitial) {
                alert("Số lượng sản phẩm vượt quá giới hạn!");
            } else {
                formAddCart.submit();
            }
        }
    });
}
//End check stock product

//Convert date
const createdAt = document.querySelectorAll(".createdAt");
if (createdAt.length > 0) {
    createdAt.forEach((item) => {
        const isoDatetime = item.getAttribute("data-time");

        // Chuyển đổi chuỗi thành đối tượng Date
        const date = new Date(isoDatetime);

        // Mảng ngày trong tuần tiếng Việt
        const daysOfWeek = [
            "Chủ Nhật",
            "Thứ Hai",
            "Thứ Ba",
            "Thứ Tư",
            "Thứ Năm",
            "Thứ Sáu",
            "Thứ Bảy",
        ];

        // Lấy các thành phần ngày, tháng, năm
        const dayOfWeek = daysOfWeek[date.getUTCDay()];
        const day = String(date.getUTCDate()).padStart(2, "0");
        const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
        const year = date.getUTCFullYear();

        // Tạo chuỗi định dạng "Thứ, ngày, tháng, năm"
        const formattedDate = `${dayOfWeek}, ${day}/${month}/${year}`;

        item.innerHTML = formattedDate;
    });
}
//End convert date

//Script slide swiper
var swiper = new Swiper(".mySwiper", {
    spaceBetween: 10,
    slidesPerView: 4,
    freeMode: true,
    watchSlidesProgress: true,
});
var swiper2 = new Swiper(".mySwiper2", {
    spaceBetween: 0,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    thumbs: {
        swiper: swiper,
    },
});
//End script slide swiper

//Apply vouchers
const formApplyVouchers = document.querySelector("#form-apply-vouchers");
if (formApplyVouchers) {
    formApplyVouchers.addEventListener("submit", (e) => {
        e.preventDefault();
        const idVoucher = formApplyVouchers.querySelector(
            "input[data]:checked"
        );
        if (!idVoucher) {
            alert("Vui lòng chọn mã giảm giá!");
            return;
        }
        const minOrder = parseFloat(idVoucher.getAttribute("min-order"));
        const totalPrice = parseFloat(
            document.querySelector("input[name=totalPrice]").value
        );
        if (totalPrice >= minOrder) {
            const path = `/${idVoucher.getAttribute("data")}/?_method=PATCH`;
            formApplyVouchers.action += path;
            formApplyVouchers.submit();
        } else {
            alert("Đơn hàng của bạn không thỏa mãn điều kiện giảm giá!");
            return;
        }
    });
}
//End apply vouchers
