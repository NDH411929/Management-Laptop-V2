//Permission
const tablePermission = document.querySelector("[table-permissions]");
if (tablePermission) {
    const buttonSubmit = document.querySelector("button[type=submit]");
    buttonSubmit.addEventListener("click", () => {
        const dataName = tablePermission.querySelectorAll("[data-name]");
        let roles = [];
        dataName.forEach((item) => {
            const name = item.getAttribute("data-name");
            const input = item.querySelectorAll("input");
            if (name == "id") {
                input.forEach((input) => {
                    const id = input.value;
                    roles.push({
                        id: id,
                        permissions: [],
                    });
                });
            } else {
                input.forEach((input, index) => {
                    const inputChecked = input.checked;
                    if (inputChecked) {
                        roles[index].permissions.push(name);
                    }
                });
            }
        });

        if (roles.length > 0) {
            const formChangePermissions = document.querySelector(
                "[form-change-permissions]"
            );
            const inputRoles = formChangePermissions.querySelector(
                "input[name='roles']"
            );
            inputRoles.value = JSON.stringify(roles);
            formChangePermissions.submit();
        }
    });
}
//End Permission

//check permission
const dataRecords = document.querySelector("[data-records]");
if (dataRecords) {
    const roles = JSON.parse(dataRecords.getAttribute("data-records"));
    const tablePermission = document.querySelector("[table-permissions]");
    const rows = tablePermission.querySelectorAll("[data-name]");

    roles.forEach((role, index) => {
        role.permissions.forEach((item) => {
            rows.forEach((row) => {
                const input = row.querySelectorAll("input");
                if (row.getAttribute("data-name") == item) {
                    input[index].checked = true;
                }
            });
        });
    });
}
//end check permission
