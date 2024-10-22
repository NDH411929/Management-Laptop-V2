// //Preview Image
// const formPreviewImage = document.querySelector("[form-preview-image]");
// if (formPreviewImage) {
//     const inputPreviewImage = document.querySelector("[input-preview-image]");
//     const previewImage = document.querySelector("[preview-image]");
//     inputPreviewImage.addEventListener("change", (event) => {
//         const file = event.target.files[0];
//         if (file) {
//             previewImage.src = URL.createObjectURL(file);
//         }
//     });
// }
// //End Preview Image

// //Delete Item
// const deleteItem = document.querySelectorAll("[button-delete]");
// if (deleteItem.length > 0) {
//     deleteItem.forEach((button) => {
//         button.addEventListener("click", () => {
//             const isConfirm = confirm("Bạn có chắc chắn muốn xóa không?");
//             if (isConfirm) {
//                 const formDelete = document.querySelector("#form-delete");
//                 const idItemDelete = button.getAttribute("data-id");
//                 const path = formDelete.getAttribute("path");
//                 formDelete.action = path + `/${idItemDelete}/?_method=DELETE`;
//                 formDelete.submit();
//             }
//         });
//     });
// }
// //End Delete Item

// //Delete Item
const deleteSpecifications = document.querySelectorAll(
    "[button-delete-specification]"
);
if (deleteSpecifications.length > 0) {
    deleteSpecifications.forEach((button) => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc chắn muốn xóa không?");
            if (isConfirm) {
                let formDelete = "";
                if (button.id == "delete-spec") {
                    formDelete = document.querySelector("#form-delete-spec");
                } else {
                    formDelete = document.querySelector(
                        "#form-delete-feature-spec"
                    );
                }
                const idItemDelete = button.getAttribute("data-id");
                const value = button.getAttribute("value");
                const path = formDelete.getAttribute("path");
                formDelete.action =
                    path + `/${idItemDelete}/${value}/?_method=DELETE`;
                formDelete.submit();
            }
        });
    });
}
// //End Delete Item

//Change-status
const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonChangeStatus.length > 0) {
    const formChangeStatus = document.querySelector("#form-change-status");
    const path = formChangeStatus.getAttribute("path");
    buttonChangeStatus.forEach((button) => {
        button.addEventListener("click", () => {
            const currentStatus = button.getAttribute("data-status");
            const idButton = button.getAttribute("data-id");

            let changeStatus = "";
            if (currentStatus == "active") {
                changeStatus = "inactive";
            } else {
                changeStatus = "active";
            }
            const action = path + `/${changeStatus}/${idButton}/?_method=PATCH`;
            formChangeStatus.action = action;
            formChangeStatus.submit();
        });
    });
}
//End Change-status
