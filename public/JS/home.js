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
