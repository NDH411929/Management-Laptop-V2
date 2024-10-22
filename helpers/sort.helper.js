module.exports.sorted = (key, value, records) => {
    if (key && value) {
        if (value == "asc") {
            records.sort((a, b) => {
                if (a[key] >= b[key]) {
                    return 1;
                } else {
                    return -1;
                }
            });
        } else {
            records.sort((a, b) => {
                if (a[key] <= b[key]) {
                    return 1;
                } else {
                    return -1;
                }
            });
        }
    } else {
        records.sort((a, b) => {
            if (a.createdAt <= b.createdAt) {
                return 1;
            } else {
                return -1;
            }
        });
    }
};

module.exports.sortedClient = (key, value, records) => {
    if (key && value) {
        if (value == "asc") {
            records.sort((a, b) => {
                if (a[key] >= b[key]) {
                    return 1;
                } else {
                    return -1;
                }
            });
        } else {
            records.sort((a, b) => {
                if (a[key] <= b[key]) {
                    return 1;
                } else {
                    return -1;
                }
            });
        }
    }
};
