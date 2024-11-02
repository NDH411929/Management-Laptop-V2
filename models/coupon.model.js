const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
    codeCoupon: String,
    thumbnail: String,
    description: String,
    discountType: {
        type: String, // giảm theo phần trăm hoặc giảm số tiền cố định
    },
    discountValue: Number,
    startDate: Date,
    expirationDate: Date,
    minOrderValue: {
        type: Number,
        default: 0, // số tiền tối thiểu để áp dụng mã
    },
    usageLimit: {
        type: Number,
        default: 1, // số lần tối đa mã có thể được sử dụng
    },
    status: {
        type: String,
        enum: ["active", "expired"],
        default: "active",
    },
    createdBy: {
        account_id: String,
        createdAt: Date,
    },
    updatedBy: [
        {
            account_id: String,
            updatedAt: Date,
        },
    ],
    deletedBy: {
        account_id: String,
        deletedAt: Date,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
});

const Coupon = mongoose.model("Coupon", couponSchema, "coupons");

module.exports = Coupon;
