const SettingGeneral = require("../../models/setting-general.model");
const systemConfig = require("../../config/system");
module.exports.general = async (req, res, next) => {
    const settingGeneral = await SettingGeneral.findOne({});
    res.locals.settingGeneral = settingGeneral;
    next();
};
