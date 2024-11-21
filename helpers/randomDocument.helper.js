module.exports.randomDocument = async (model) => {
    try {
        const count = await model.countDocuments();
        const random = Math.floor(Math.random() * count);
        const result = await model
            .find({
                status: "active",
                deleted: false,
            })
            .skip(random)
            .limit(5); // Bỏ qua random số document
        return result;
    } catch (err) {
        console.error(err);
    }
};
