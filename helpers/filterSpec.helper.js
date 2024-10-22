module.exports.getNameFilter = (products) => {
    let arrName = [];
    for (const item of products) {
        for (const i of item.features_spec) {
            if (!arrName.includes(i.nameFeaturesSpec)) {
                arrName.push(i.nameFeaturesSpec);
            }
        }
        item.priceOld = item.price.toFixed(2);
    }
    let arrObj = [];
    for (const item of arrName) {
        let obj = {
            name: "",
            value: [],
        };
        obj.name = item;
        for (const i of products) {
            for (const k of i.features_spec) {
                if (
                    item == k.nameFeaturesSpec &&
                    !obj.value.includes(k.valueDefault)
                ) {
                    obj.value.push(k.valueDefault);
                }
            }
        }
        arrObj.push(obj);
    }
    return arrObj;
};

module.exports.filterSpec = (query, products) => {
    let newProducts = [];
    const key = Object.keys(query)[0].toLowerCase().replace(/\s+/g, "");
    const value = Object.values(query)[0].toLowerCase().replace(/\s+/g, "");
    const dataFilter = key + "-" + value;
    for (const element of products) {
        let dataSpec = [];
        for (const item of element.features_spec) {
            const dataName = item.nameFeaturesSpec
                .toLowerCase()
                .replace(/\s+/g, "");
            const dataValue = item.valueDefault
                .toLowerCase()
                .replace(/\s+/g, "");
            dataSpec.push(dataName + "-" + dataValue);
        }
        if (dataSpec.includes(dataFilter)) {
            newProducts.push(element);
        }
    }
    return newProducts;
};

module.exports.filterMultiSpec = (query, products) => {
    let newProducts = [];
    let arrCheck = "true";
    let arrQuery = [];
    const arrKey = Object.keys(query);
    const arrValue = Object.values(query);
    for (var i = 0; i < arrKey.length; i++) {
        arrKey[i] = arrKey[i].toLowerCase().replace(/\s+/g, "");
        arrValue[i] = arrValue[i].toLowerCase().replace(/\s+/g, "");
        arrQuery.push(arrKey[i] + "-" + arrValue[i]);
    }
    for (const element of products) {
        let dataSpec = [];
        for (const item of element.features_spec) {
            const dataName = item.nameFeaturesSpec
                .toLowerCase()
                .replace(/\s+/g, "");
            const dataValue = item.valueDefault
                .toLowerCase()
                .replace(/\s+/g, "");
            dataSpec.push(dataName + "-" + dataValue);
        }
        for (const item of arrQuery) {
            if (!dataSpec.includes(item)) {
                arrCheck = "false";
                break;
            } else {
                arrCheck = "true";
            }
        }
        if (arrCheck != "false") {
            newProducts.push(element);
        }
    }
    return newProducts;
};

module.exports.filterUserChoosed = (queryUser, products) => {
    let arrFilter = [];
    for (var k = 0; k < Object.keys(queryUser).length; k++) {
        let object = {};
        for (const item of products) {
            for (const i of item.features_spec) {
                if (
                    i.nameFeaturesSpec.toLowerCase().replace(/\s+/g, "") ==
                        Object.keys(queryUser)[k] &&
                    i.valueDefault.toLowerCase().replace(/\s+/g, "") ==
                        Object.values(queryUser)[k]
                ) {
                    object.name = i.nameFeaturesSpec;
                    object.value = i.valueDefault;
                }
            }
        }
        arrFilter.push(object);
    }
    return arrFilter;
};
