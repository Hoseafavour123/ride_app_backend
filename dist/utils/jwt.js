"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.signToken = exports.defaultRefreshTokenOptions = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const defaultAccessTokenOptions = {
    expiresIn: '59m',
    secret: process.env.JWT_SECRET,
};
exports.defaultRefreshTokenOptions = {
    expiresIn: '30d',
    secret: process.env.JWT_REFRESH_SECRET,
};
const signToken = (payload, options) => {
    const { secret, ...signOpts } = options ?? defaultAccessTokenOptions;
    // Remove 'aud' from payload before signing
    const { aud, ...restPayload } = payload;
    return jsonwebtoken_1.default.sign(restPayload, secret, {
        audience: aud,
        ...signOpts,
    });
};
exports.signToken = signToken;
const verifyToken = (token, expectedAudience, options) => {
    const { secret = process.env.JWT_SECRET, ...verifyOpts } = options ?? {};
    try {
        const payload = jsonwebtoken_1.default.verify(token, secret, {
            ...verifyOpts,
            audience: expectedAudience,
        });
        return { payload };
    }
    catch (error) {
        return { error: error.message };
    }
};
exports.verifyToken = verifyToken;
