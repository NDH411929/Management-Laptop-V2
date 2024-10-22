const formReset = document.querySelector("[form-reset]");

if (formReset) {
    formReset.addEventListener("submit", (e) => {
        e.preventDefault();
        const password = formReset.querySelector("#password").value;
        const confirmPassword =
            formReset.querySelector("#confirmPassword").value;
        if (password !== confirmPassword) {
            alert("Xác nhận mật khẩu không khớp");
            return;
        }
        formReset.submit();
    });
}
