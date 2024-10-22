const buttonStatusDelivery = document.querySelectorAll(
    "[button-status-delivery]"
);
if (buttonStatusDelivery.length > 0) {
    let url = new URL(window.location.href);
    buttonStatusDelivery.forEach((button) => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status-delivery");
            if (status) {
                url.searchParams.delete("page");
                url.searchParams.delete("status");
                url.searchParams.set("statusDelivery", status);
            } else {
                url.searchParams.delete("statusDelivery");
                url.searchParams.delete("status");
            }
            window.location.href = url.href;
        });
    });
}
const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonChangeStatus.length > 0) {
    const formChangeStatus = document.querySelector("#form-change-status");
    const formPath = formChangeStatus.getAttribute("path");
    buttonChangeStatus.forEach((button) => {
        button.addEventListener("click", () => {
            const currentStatus = button.getAttribute("data-status");
            const id = button.getAttribute("data-id");
            let changeStatus = "";
            if (currentStatus == "initial") {
                changeStatus = "approved";
            } else {
                changeStatus = "initial";
            }
            //Override method "POST" form => "PATCH"
            const action = formPath + `/${changeStatus}/${id}/?_method=PATCH`;
            formChangeStatus.action = action;
            formChangeStatus.submit();
        });
    });
}

const buttonChangeStatusDelivery = document.querySelectorAll(
    "[button-change-status-delivery]"
);
if (buttonChangeStatusDelivery.length > 0) {
    const formChangeStatusDelivery = document.querySelector(
        "#form-change-status-delivery"
    );
    const formPathDelivery = formChangeStatusDelivery.getAttribute("path");
    buttonChangeStatusDelivery.forEach((button) => {
        button.addEventListener("click", () => {
            const currentStatus = button.getAttribute("data-status");
            const id = button.getAttribute("data-id");
            let changeStatusDelivery = "";
            if (currentStatus == "processing") {
                changeStatusDelivery = "shipping";
            }
            if (currentStatus == "shipping") {
                changeStatusDelivery = "stop-shipping";
            }
            if (currentStatus == "stop-shipping") {
                changeStatusDelivery = "delivered";
            }
            if (currentStatus == "delivered") {
                changeStatusDelivery = "processing";
            }
            const actionDelivery =
                formPathDelivery +
                `/${changeStatusDelivery}/${id}/?_method=PATCH`;
            formChangeStatusDelivery.action = actionDelivery;
            formChangeStatusDelivery.submit();
        });
    });
}
