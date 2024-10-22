const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonChangeStatus) {
    const formChangeStatus = document.querySelector("#form-change-status");
    const path = formChangeStatus.getAttribute("path");
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
            const action = path + `/${changeStatus}/${id}/?_method=PATCH`;
            formChangeStatus.action = action;
            formChangeStatus.submit();
        });
    });
}
