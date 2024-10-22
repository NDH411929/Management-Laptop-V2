const SettingGeneral = require("../../models/setting-general.model");

module.exports.settingGeneral = async (req, res) => {
    try {
        const settingGeneral = await SettingGeneral.findOne({});
        res.render("admin/pages/setting/general", {
            title: "Cài đặt chung",
            settingGeneral: settingGeneral,
        });
    } catch (error) {
        res.redirect("back");
    }
};

module.exports.settingGeneralPatch = async (req, res) => {
    try {
        const setting = await SettingGeneral.findOne({});
        if (!setting) {
            const settingGeneral = new SettingGeneral(req.body);
            settingGeneral.save();
        } else {
            await SettingGeneral.updateOne(
                {
                    _id: setting.id,
                },
                req.body
            );
        }
        res.redirect("back");
    } catch (error) {
        res.redirect("back");
    }
};
