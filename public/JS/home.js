//sidebar
const megaItem = document.querySelectorAll(".mega-item");
if (megaItem) {
    megaItem.forEach((element) => {
        element.addEventListener("mouseover", () => {
            const subMega = element.querySelector(".sub-megamenu");
            const megaLink = element.querySelector(".mega-link");
            megaLink.classList.add("add-class");
            subMega.setAttribute("style", "display:block");

            megaLink.setAttribute(
                "style",
                "background-color:#e30019;color:#fff"
            );
        });
        element.addEventListener("mouseout", () => {
            const subMega = element.querySelector(".sub-megamenu");
            const megaLink = element.querySelector(".mega-link");
            subMega.setAttribute("style", "display:none");
            megaLink.removeAttribute("style");
            megaLink.classList.remove("add-class");
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
