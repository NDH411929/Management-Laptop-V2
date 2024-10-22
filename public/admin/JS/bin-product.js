//Checkbox Multi
const checkBoxMulti = document.querySelector("[checkbox-multi]");
if (checkBoxMulti) {
    const inputCheckAll = document.querySelector("input[name='checkall']");
    const inputsId = document.querySelectorAll("input[name='id']");
    inputCheckAll.addEventListener("click", () => {
        if (inputCheckAll.checked) {
            inputsId.forEach((input) => {
                input.checked = true;
            });
        } else {
            inputsId.forEach((input) => {
                input.checked = false;
            });
        }
    });

    inputsId.forEach((input) => {
        input.addEventListener("click", () => {
            const countInputChecked = document.querySelectorAll(
                "input[name='id']:checked"
            ).length;
            if (countInputChecked == inputsId.length) {
                inputCheckAll.checked = true;
            } else {
                inputCheckAll.checked = false;
            }
        });
    });
}
//End Checkbox Multi

//Return Product
const returnProduct = document.querySelectorAll("[button-return]");
if (returnProduct.length > 0) {
    returnProduct.forEach((button) => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có muốn khôi phục sản phẩm này?");
            if (isConfirm) {
                const idProductReturn = button.getAttribute("data-id");
                const formReturn = document.querySelector("#form-return");
                const path = formReturn.getAttribute("path");
                formReturn.action = path + `/${idProductReturn}/?_method=PATCH`;
                formReturn.submit();
            }
        });
    });
}
//End Return Product

//Delete Product
const deleteProduct = document.querySelectorAll("[button-delete]");
if (deleteProduct.length > 0) {
    deleteProduct.forEach((button) => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc chắn muốn xóa không?");
            if (isConfirm) {
                const formDelete = document.querySelector("#form-delete");
                const idProductDelete = button.getAttribute("data-id");
                const path = formDelete.getAttribute("path");
                formDelete.action =
                    path + `/${idProductDelete}/?_method=DELETE`;
                formDelete.submit();
            }
        });
    });
}
//End Delete Product

//Update date delete

//Return & delete multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();
        const recordsChecked = document.querySelectorAll("[name=id]:checked");
        const iDs = document.querySelector("[name=ids]");
        const option = e.target.elements.type.value;

        let listID = [];
        recordsChecked.forEach((record) => {
            listID.push(record.value);
        });
        iDs.value = listID.join(", ");
        if (option == "delete-all") {
            var isConfirm = confirm(
                `Bạn có chắc chắn muốn xóa vĩnh viễn ${listID.length} sản phẩm không?`
            );
        } else {
            var isConfirm = confirm(
                `Bạn có chắc chắn muốn khôi phục ${listID.length} sản phẩm không?`
            );
        }
        if (!isConfirm) {
            return;
        }
        formChangeMulti.submit();
    });
}
//End Return & delete multi
