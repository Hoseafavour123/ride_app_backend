"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = require("../utils/bcrypt");
var UserRole;
(function (UserRole) {
    UserRole["PASSENGER"] = "passenger";
    UserRole["DRIVER"] = "driver";
    UserRole["ADMIN"] = "admin";
})(UserRole || (exports.UserRole = UserRole = {}));
const UserSchema = new mongoose_1.default.Schema({
    fullName: { type: String, required: true },
    phone: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    birthDate: { type: Date, required: false },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.PASSENGER,
    },
    vehicle: { type: String },
    rating: { type: Number, default: 0 },
    refreshToken: { type: String },
}, { timestamps: true });
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    if (this.password) {
        this.password = await (0, bcrypt_1.hashValue)(this.password);
    }
    return next();
});
UserSchema.methods.comparePassword = async function (val) {
    return (0, bcrypt_1.compareValue)(val, this.password);
};
UserSchema.methods.omitPassword = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};
const UserModel = mongoose_1.default.model("User", UserSchema);
exports.default = UserModel;
