//Button status
const buttonStatus = document.querySelectorAll("[button-status]");
if (buttonStatus.length > 0) {
    let url = new URL(window.location.href);
    buttonStatus.forEach((button) => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");
            if (status) {
                url.searchParams.delete("page");
                url.searchParams.delete("statusDelivery");
                url.searchParams.set("status", status);
            } else {
                url.searchParams.delete("status");
                url.searchParams.delete("statusDelivery");
            }
            window.location.href = url.href;
        });
    });
}
//End Button status

//Change Status
const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonChangeStatus.length > 0) {
    const formChangeStatus = document.querySelector("#form-change-status");
    const formPath = formChangeStatus.getAttribute("path");
    buttonChangeStatus.forEach((button) => {
        button.addEventListener("click", () => {
            const currentStatus = button.getAttribute("data-status");
            const id = button.getAttribute("data-id");
            let changeStatus = "";
            if (currentStatus == "active") {
                changeStatus = "inactive";
            } else {
                changeStatus = "active";
            }
            //Override method "POST" form => "PATCH"
            const action = formPath + `/${changeStatus}/${id}/?_method=PATCH`;
            formChangeStatus.action = action;
            formChangeStatus.submit();
        });
    });
}
//End Change Status

//Delete Item
const deleteSpecification = document.querySelectorAll("[button-delete]");
if (deleteSpecification.length > 0) {
    deleteSpecification.forEach((button) => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc chắn muốn xóa không?");
            if (isConfirm) {
                const formDelete = document.querySelector("#form-delete");
                const idItemDelete = button.getAttribute("data-id");
                const path = formDelete.getAttribute("path");
                formDelete.action = path + `/${idItemDelete}/?_method=DELETE`;
                formDelete.submit();
            }
        });
    });
}
//End Delete Item

//Form search
const formSearch = document.querySelector("#form-search");
if (formSearch) {
    let url = new URL(window.location.href);
    formSearch.addEventListener("submit", (event) => {
        event.preventDefault();
        //Get value in form-search
        const keyword = event.target.elements.keyword.value;
        //Set params for URL
        if (keyword) {
            url.searchParams.delete("page");
            url.searchParams.set("keyword", keyword);
        } else {
            url.searchParams.delete("keyword");
        }
        window.location.href = url.href;
    });
}
//End Form search

//Pagination
const pageLink = document.querySelectorAll(".page-link");
if (pageLink.length > 0) {
    let url = new URL(window.location.href);
    pageLink.forEach((button) => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination");
            if (page) {
                url.searchParams.set("page", page);
            } else {
                url.searchParams.delete("page");
            }
            window.location.href = url.href;
        });
    });
}
//End Pagination

//Show Alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
    const closeAlert = showAlert.querySelector("[close-alert]");
    const timeAlert = showAlert.getAttribute("data-time");
    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("hidden-alert");
    });
    setTimeout(() => {
        showAlert.classList.add("hidden-alert");
    }, timeAlert);
}
//End Show Alert

//Sort
const sort = document.querySelector("[sort]");
if (sort) {
    let url = new URL(window.location.href);
    const sortSelected = sort.querySelector("[sort-select]");
    const buttonClear = sort.querySelector("[sort-clear]");
    //sort
    sortSelected.addEventListener("change", (event) => {
        const [keySelect, keyValue] = event.target.value.split("-");
        url.searchParams.set("keySelect", keySelect);
        url.searchParams.set("keyValue", keyValue);
        window.location.href = url.href;
    });
    //clear option
    buttonClear.addEventListener("click", () => {
        url.searchParams.delete("keySelect");
        url.searchParams.delete("keyValue");
        window.location.href = url.href;
    });
    //End clear option
    //option selected
    const keySelect = url.searchParams.get("keySelect");
    const keyValue = url.searchParams.get("keyValue");
    const string = `${keySelect}-${keyValue}`;
    const optionSelected = sortSelected.querySelector(
        `option[value=${string}]`
    );
    if (optionSelected) {
        optionSelected.selected = true;
    }
    //End option selected
}
//End sort

//Preview Image
const formPreviewImage = document.querySelector("[form-preview-image]");
if (formPreviewImage) {
    const inputPreviewImage = document.querySelector("[input-preview-image]");
    const previewImage = document.querySelector("[preview-image]");
    inputPreviewImage.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            previewImage.src = URL.createObjectURL(file);
        }
        console.log(previewImage);
        console.log(inputPreviewImage);
    });
}
//End Preview Image

//Alert Inform
const eventCreate = document.querySelector("[no-create]");
if (eventCreate) {
    eventCreate.addEventListener("click", () => {
        alert("Bạn không có quyền thêm mới");
    });
}

const eventEdit = document.querySelector("[no-edit]");
if (eventEdit) {
    eventEdit.addEventListener("click", () => {
        alert("Bạn không có quyền chỉnh sửa");
    });
}

const eventView = document.querySelector("[no-view]");
if (eventView) {
    eventView.addEventListener("click", () => {
        alert("Bạn không có quyền xem chi tiết");
    });
}

const evenDelete = document.querySelector("[no-delete]");
if (evenDelete) {
    evenDelete.addEventListener("click", () => {
        alert("Bạn không có quyền xóa");
    });
}
//End Alert Inform

const showPassword = document.querySelector(".show-password");
if (showPassword) {
    showPassword.addEventListener("click", () => {
        const inputUser = document.querySelector("[show-password]");
        let showPassword = inputUser.getAttribute("type");
        if (showPassword == "password") {
            inputUser.setAttribute("type", "text");
        } else {
            inputUser.setAttribute("type", "password");
        }

        // inputUser.classList.add("input-password");
    });
}
