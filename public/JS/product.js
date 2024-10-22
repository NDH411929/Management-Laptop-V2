const submit = document.querySelectorAll("[submit-filter]");
if (submit.length > 0) {
    submit.forEach((button) => {
        button.addEventListener("click", () => {
            let url = new URL(window.location.href);
            const chooes = document.querySelectorAll("input[type=checkbox]");
            let cleanUrl = window.location.href.split("?")[0];
            window.location.href = cleanUrl;
            chooes.forEach((input) => {
                if (input.checked) {
                    let name = input.getAttribute("data-name");
                    name = name.toLowerCase().replace(/\s+/g, "");
                    let value = input.getAttribute("data-value");
                    value = value.toLowerCase().replace(/\s+/g, "");
                    url.searchParams.set(name, value);
                }
            });
            window.location.href = url.href;
        });
    });
}

const label = document.querySelectorAll(".label-ip");
if (label) {
    label.forEach((item) => {
        item.addEventListener("click", () => {
            if (item.classList.contains("active")) {
                item.classList.remove("active");
            } else {
                item.classList.add("active");
            }
        });
    });
}

const deleteFilter = document.querySelectorAll(".delete-filter");
if (deleteFilter) {
    let url = new URL(window.location.href);
    deleteFilter.forEach((item) => {
        item.addEventListener("click", () => {
            let data = item.getAttribute("data");
            data = data.toLowerCase().replace(/\s+/g, "");
            url.searchParams.delete(data);
            window.location.href = url.href;
        });
    });
}

const deleteAllFilter = document.querySelector(".delete-filter-all");
if (deleteAllFilter) {
    let url = new URL(window.location.href);
    deleteAllFilter.addEventListener("click", () => {
        url.search = "";
        window.location.href = url.href;
    });
}

const sort = document.querySelector("[sort]");
if (sort) {
    let url = new URL(window.location.href);
    const sortSelected = sort.querySelector("[sort-select]");
    //sort
    sortSelected.addEventListener("change", (event) => {
        url.searchParams.set("sort_by", event.target.value);
        const keyValue = url.searchParams.get("sort_by");
        if (keyValue == "") {
            url.searchParams.delete("sort_by");
        }
        window.location.href = url.href;
    });
    //option selected
    const keyValue = url.searchParams.get("sort_by");
    const optionSelected = sortSelected.querySelector(
        `option[value=${keyValue}]`
    );
    if (optionSelected) {
        optionSelected.selected = true;
    }
    //End option selected
}
//End sort

let description_box = document.querySelector(".description_box");

if (description_box) {
    let button = description_box.querySelector(".btn-readmore");
    button.addEventListener("click", () => {
        description_box.classList.toggle("active-readmore");
        button.classList.toggle("active_button");
        if (button.classList.contains("active_button")) {
            button.innerHTML = "Thu gọn bài viết";
        } else {
            button.innerHTML = "Đọc tiếp bài viết";
        }
    });
}

//Reviews
const reviews = document.querySelectorAll(".item-reviews");
if (reviews) {
    reviews.forEach((item) => {
        item.addEventListener("click", () => {
            const inputValue = document.querySelector("input[data-reviews]");
            const value = item.getAttribute("data");
            inputValue.value = value;
            reviews.forEach((chooes) => {
                if (chooes.getAttribute("data") <= value) {
                    chooes.classList.add("chooes");
                } else {
                    chooes.classList.remove("chooes");
                }
            });
        });
    });
}

const brand = document.querySelectorAll(".brand");
if (brand) {
    brand.forEach((item) => {
        if (item.getAttribute("data") == item.getAttribute("keyword")) {
            item.classList.add("active");
        }
    });
}
