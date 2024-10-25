//Form create product
const formCreateProduct = document.querySelector("#form-create-product");
if (formCreateProduct) {
    formCreateProduct.addEventListener("submit", (e) => {
        e.preventDefault();
    });
}

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

//Checkbox Multi
const checkBoxMulti = document.querySelector("[checkbox-multi]");
if (checkBoxMulti) {
    const inputCheckAll = document.querySelector("input[name='checkall']");
    const inputsId = document.querySelectorAll("input[name='id']");
    if (inputCheckAll) {
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
    }

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

//Change Multi Status
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();
        const checkBoxMulti = document.querySelector("[checkbox-multi]");
        const inputsChecked = checkBoxMulti.querySelectorAll(
            "input[name='id']:checked"
        );

        if (inputsChecked.length > 0) {
            //Delete products checked
            const typeChange =
                formChangeMulti.querySelector("select[name=type]");
            if (typeChange.value == "delete-all") {
                const isConfirm = confirm("Bạn có chắc chắn muốn xóa không?");
                if (!isConfirm) {
                    return;
                }
            }

            const inputIds = formChangeMulti.querySelector("input[name='ids']");
            let listID = [];
            inputsChecked.forEach((input) => {
                if (typeChange.value == "update-position") {
                    const positionProduct = input
                        .closest("tr")
                        .querySelector("input[name=position]").value;
                    listID.push(`${input.value}-${positionProduct}`);
                } else {
                    listID.push(input.value);
                }
            });
            inputIds.value = listID.join(", ");
            formChangeMulti.submit();
        } else {
            alert("Vui lòng chọn ít nhất 1 bản ghi");
        }
    });
}
//End Change Multi Status

//Delete Specification
const deleteItem = document.querySelectorAll("[button-delete-specification]");
if (deleteItem.length > 0) {
    deleteItem.forEach((button) => {
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
                console.log(formDelete);
                const idItemDelete = button.getAttribute("data-id");
                const dataItem = button.getAttribute("data");
                const path = formDelete.getAttribute("path");
                formDelete.action =
                    path + `/${dataItem}/${idItemDelete}/?_method=DELETE`;
                formDelete.submit();
            }
        });
    });
}
//End Delete Specification

const parentId = document.querySelector("#parent_id");
if (parentId) {
    parentId.addEventListener("change", () => {
        const idCategory = parentId.value;
        const listOptions = document.querySelectorAll("option[data-brands]");
        listOptions.forEach((item) => {
            if (item.value == idCategory) {
                const arr = JSON.parse(item.getAttribute("data-brands"));
                console.log(arr);
                const select = document.querySelector("#brand");
                if (select.childElementCount <= 1) {
                    arr.forEach((element) => {
                        var opt = document.createElement("option");
                        opt.value = element._id;
                        opt.innerHTML = element.name;
                        select.appendChild(opt);
                    });
                } else {
                    select.innerHTML = "";
                    let firstOption = document.createElement("option");
                    firstOption.value = "";
                    firstOption.innerHTML = "-- Chọn thương hiệu --";
                    select.appendChild(firstOption);
                    arr.forEach((element) => {
                        var opt = document.createElement("option");
                        opt.value = element._id;
                        opt.innerHTML = element.name;
                        select.appendChild(opt);
                    });
                }
            }
        });
    });
}

//Create color
const submitColor = document.querySelector(".submit-colors");
if (submitColor) {
    let listColor = [];
    submitColor.addEventListener("click", () => {
        const codeColor = document.querySelector("input#code_color").value;
        const nameColor = document.querySelector("input#name_color").value;
        let objectColor = {
            name_color: nameColor,
            code_color: codeColor,
        };
        const color = document.querySelector("#color");
        let check = "false";
        listColor.forEach((item) => {
            if (item.name_color == nameColor || item.code_color == codeColor) {
                check = "true";
                return;
            }
        });
        if (check == "false") {
            listColor.push(objectColor);
            color.value = JSON.stringify(listColor);
            alert("Thêm màu thành công!");
        } else {
            alert("Màu đã được thêm! Vui lòng chọn màu khác!");
        }
    });
}
//End create color

//Edit Color
const formEditProduct = document.querySelector("#form-edit-product");
if (formEditProduct) {
    formEditProduct.addEventListener("submit", (event) => {
        event.preventDefault();
        let listColor = [];
        const editColor = document.querySelectorAll("[edit-color]");
        editColor.forEach((item) => {
            const codeColor = item.querySelector(".edit-code_color").value;
            const nameColor = item.querySelector(".edit-name_color").value;
            let objectColor = {
                name_color: nameColor,
                code_color: codeColor,
            };
            listColor.push(objectColor);
        });
        const color = document.querySelector("#edit-color");
        color.value = JSON.stringify(listColor);
        formEditProduct.submit();
    });
}

// Add color
const addColorAnother = document.querySelector("[add-color-another]");
if (addColorAnother) {
    addColorAnother.addEventListener("click", () => {
        let groupColor = document.querySelector("[form-group-color]");

        // Create div
        const newDiv = document.createElement("div");
        newDiv.classList.add("d-flex");
        newDiv.setAttribute("style", "gap:5px;margin-top:5px");
        newDiv.setAttribute("data-new", "");
        newDiv.setAttribute("edit-color", "");

        // Tạo phần tử input đầu tiên (type="text")
        const inputText = document.createElement("input");
        inputText.classList.add("form-control", "edit-name_color");
        inputText.setAttribute("type", "text");
        inputText.setAttribute("style", "width:300px");

        // Tạo phần tử input thứ hai (type="color")
        const inputColor = document.createElement("input");
        inputColor.classList.add("form-control", "edit-code_color");
        inputColor.setAttribute("type", "color");
        inputColor.setAttribute("style", "width:100px");

        // Tạo phần tử a (nút "Remove")
        const removeBtn = document.createElement("a");
        removeBtn.classList.add("btn");
        removeBtn.setAttribute("style", "border:1px solid #ced4da");
        removeBtn.setAttribute("data-new", "");
        removeBtn.textContent = "Remove";

        // Thêm các phần tử con vào trong div
        newDiv.appendChild(inputText);
        newDiv.appendChild(inputColor);
        newDiv.appendChild(removeBtn);
        groupColor.appendChild(newDiv);

        // Remove div khi nhấn nút "Remove"
        removeBtn.addEventListener("click", () => {
            if (groupColor.contains(newDiv)) {
                newDiv.remove();
            }
        });
    });
}
// End add color

//Remove color
const groupColor = document.querySelector("[form-group-color]");
if (groupColor) {
    const editColor = groupColor.querySelectorAll("[edit-color]");
    editColor.forEach((item) => {
        const buttonRemove = item.querySelector("a[remove-color]");
        buttonRemove.addEventListener("click", () => {
            groupColor.removeChild(item);
        });
    });
}
//End remove color
