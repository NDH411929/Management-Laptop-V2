const tablePermission = document.querySelector("[table-permissions]");
if (tablePermission) {
    const dataRecords = JSON.parse(
        document.querySelector("[data-records]").getAttribute("data-records")
    );

    const input = tablePermission.querySelectorAll("input[type=checkbox]");

    input.forEach((item) => {
        const detailItem = item.getAttribute("data-name");
        dataRecords.forEach((record) => {
            record.arrayPermission.forEach((element) => {
                const string = element + "_" + record.title;
                if (detailItem == string) {
                    item.checked = true;
                }
            });
        });
    });
}
