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
