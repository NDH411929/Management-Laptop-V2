const buttonSubmit = document.querySelectorAll("div[type=primary]");
if (buttonSubmit) {
    buttonSubmit.forEach((item) => {
        item.addEventListener("click", () => {
            const data = item.getAttribute("data");
            const input = document.querySelector(`#${data}`);
            const couponBackground = document.querySelector(
                `svg[data=${data}]`
            );
            const outline = couponBackground.querySelector(".path1");
            const verticalOutline =
                couponBackground.querySelector(".transform2");
            if (input.checked == false) {
                const buttonSubmit =
                    document.querySelectorAll("div[type=primary]");
                buttonSubmit.forEach((elm) => {
                    elm.classList.remove("active");
                    elm.innerHTML = "Áp dụng";
                });
                const listOutline = document.querySelectorAll(".path1");
                listOutline.forEach((elm) => {
                    elm.setAttribute("stroke", "#eee");
                    elm.setAttribute(
                        "d",
                        "M423.20001220703125 0c4.418 0 8 3.582 8 8v116c0 4.418-3.582 8-8 8H140.5c0-4.419-3.582-8-8-8s-8 3.581-8 8H8c-4.418 0-8-3.582-8-8V8c0-4.418 3.582-8 8-8h116.5c0 4.418 3.582 8 8 8s8-3.582 8-8H392z"
                    );
                    elm.classList.remove("set-bg");
                });
                const listVertical = document.querySelectorAll(".transform2");
                listVertical.forEach((elm) => {
                    elm.classList.remove("set-outline");
                });
                outline.setAttribute("stroke", "#017FFF");
                outline.setAttribute(
                    "d",
                    "M 423.20001220703125 0.5 c 2.071 0 3.946 0.84 5.303 2.197 c 1.358 1.357 2.197 3.232 2.197 5.303 h 0 v 116 c 0 2.071 -0.84 3.946 -2.197 5.303 c -1.357 1.358 -3.232 2.197 -5.303 2.197 h 0 H 140.986 c -0.125 -2.148 -1.047 -4.082 -2.475 -5.51 c -1.539 -1.54 -3.664 -2.49 -6.011 -2.49 s -4.472 0.95 -6.01 2.489 c -1.429 1.428 -2.35 3.362 -2.476 5.51 h 0 l -116.014 0.001 c -2.071 0 -3.946 -0.84 -5.303 -2.197 c -1.358 -1.357 -2.197 -3.232 -2.197 -5.303 h 0 V 8 c 0 -2.071 0.84 -3.946 2.197 -5.303 c 1.357 -1.358 3.232 -2.197 5.303 -2.197 h 116.014 c 0.125 2.148 1.047 4.082 2.476 5.51 c 1.538 1.539 3.663 2.49 6.01 2.49 s 4.472 -0.951 6.01 -2.49 c 1.429 -1.428 2.35 -3.362 2.476 -5.51 H 140.986 z"
                );
                outline.classList.add("set-bg");
                verticalOutline.classList.add("set-outline");
                item.classList.add("active");
                input.checked = true;
            } else {
                outline.setAttribute("stroke", "#eee");
                outline.setAttribute(
                    "d",
                    "M423.20001220703125 0c4.418 0 8 3.582 8 8v116c0 4.418-3.582 8-8 8H140.5c0-4.419-3.582-8-8-8s-8 3.581-8 8H8c-4.418 0-8-3.582-8-8V8c0-4.418 3.582-8 8-8h116.5c0 4.418 3.582 8 8 8s8-3.582 8-8H392z"
                );
                outline.classList.remove("set-bg");
                verticalOutline.classList.remove("set-outline");
                item.classList.remove("active");
                input.checked = false;
            }
            if (item.classList.contains("active")) {
                item.innerHTML = "Bỏ chọn";
            } else {
                item.innerHTML = "Áp dụng";
            }
        });
    });
}

const dateString = document.querySelectorAll("[data-date]");
if (dateString) {
    dateString.forEach((item) => {
        const date = new Date(item.getAttribute("data-date"));

        // Lấy ngày, tháng và năm
        const day = date.getUTCDate().toString().padStart(2, "0");
        const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
        const year = date.getUTCFullYear();

        // Kết quả định dạng
        const formattedDate = `HSD: ${day}/${month}/${year}`;
        item.innerHTML = formattedDate;
    });
}
