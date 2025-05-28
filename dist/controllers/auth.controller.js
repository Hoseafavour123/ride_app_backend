"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.facebookAuthHandler = exports.googleAuthHandler = exports.logoutHandler = exports.refreshHandler = exports.loginHandler = exports.registerHandler = exports.verifyPhoneCodeHandler = exports.requestPhoneCodeHandler = void 0;
const http_1 = require("../constants/http");
const session_model_1 = __importDefault(require("../models/session.model"));
const auth_service_1 = require("../services/auth.service");
const appAssert_1 = __importDefault(require("../utils/appAssert"));
const cookies_1 = require("../utils/cookies");
const jwt_1 = require("../utils/jwt");
const catchErrors_1 = __importDefault(require("../utils/catchErrors"));
const auth_schemas_1 = require("./auth.schemas");
const audience_1 = __importDefault(require("../constants/audience"));
exports.requestPhoneCodeHandler = (0, catchErrors_1.default)(async (req, res) => {
    const { phone } = auth_schemas_1.phoneRequestSchema.parse(req.body);
    const result = await (0, auth_service_1.requestPhoneVerification)(phone);
    return res.status(200).json({
        status: 'success',
        data: {
            phone: result.phone,
            expiresAt: result.expiresAt,
            message: 'Verification code sent',
        },
    });
});
exports.verifyPhoneCodeHandler = (0, catchErrors_1.default)(async (req, res) => {
    const { phone, code } = auth_schemas_1.phoneVerifySchema.parse(req.body);
    const result = await (0, auth_service_1.verifyPhoneCode)(phone, code);
    return res.status(200).json({
        status: 'success',
        message: 'Phone verified',
        data: result,
    });
});
exports.registerHandler = (0, catchErrors_1.default)(async (req, res) => {
    const request = auth_schemas_1.registerSchema.parse({
        ...req.body,
        userAgent: req.headers['user-agent'],
    });
    const { user, accessToken, refreshToken } = await (0, auth_service_1.createAccount)(request);
    const useCookies = req.body.useCookies ?? false;
    // Set tokens nd respond with user data
    (0, cookies_1.setAuthTokens)({ res, accessToken, refreshToken, useCookies });
    return res.status(http_1.CREATED).json({
        status: 'success',
        data: {
            user,
        },
    });
});
// Login (Email/Password)
exports.loginHandler = (0, catchErrors_1.default)(async (req, res) => {
    const request = auth_schemas_1.loginSchema.parse({
        ...req.body,
        userAgent: req.headers['user-agent'],
    });
    const { user, accessToken, refreshToken } = await (0, auth_service_1.loginUser)(request);
    const useCookies = req.body.useCookies ?? false;
    (0, cookies_1.setAuthTokens)({ res, accessToken, refreshToken, useCookies });
    return res.status(http_1.OK).json({
        status: 'success',
        data: {
            user,
        },
    });
});
// Refresh Token
exports.refreshHandler = (0, catchErrors_1.default)(async (req, res) => {
    const refreshToken = req.cookies.refreshToken ?? req.body.refreshToken ?? undefined;
    (0, appAssert_1.default)(refreshToken, http_1.UNAUTHORIZED, 'Missing refresh token');
    const { accessToken, newRefreshToken } = await (0, auth_service_1.refreshUserAccessToken)(refreshToken);
    const useCookies = req.body.useCookies ?? !!req.cookies.refreshToken;
    return (0, cookies_1.setAuthTokens)({
        res,
        accessToken,
        refreshToken: newRefreshToken ?? refreshToken,
        useCookies,
    });
});
exports.logoutHandler = (0, catchErrors_1.default)(async (req, res) => {
    const authHeader = req.headers.authorization;
    const accessToken = req.cookies.accessToken ??
        (authHeader && authHeader.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : undefined);
    if (!accessToken) {
        (0, cookies_1.clearAuthCookies)(res);
        return res.status(http_1.OK).json({
            status: 'success',
            message: 'No token found. Already logged out.',
        });
    }
    const { payload } = (0, jwt_1.verifyToken)(accessToken, audience_1.default.User);
    if (payload) {
        await session_model_1.default.findByIdAndDelete(payload.sessionId);
    }
    (0, cookies_1.clearAuthCookies)(res);
    return res.status(http_1.OK).json({
        status: 'success',
        message: 'Logout successful',
    });
});
// Google Sign-In
exports.googleAuthHandler = (0, catchErrors_1.default)(async (req, res) => {
    const request = auth_schemas_1.googleAuthSchema.parse({
        ...req.body,
        userAgent: req.headers['user-agent'],
    });
    const { user, accessToken, refreshToken } = await (0, auth_service_1.loginWithGoogle)(request);
    const useCookies = req.body.useCookies ?? false;
    (0, cookies_1.setAuthTokens)({ res, accessToken, refreshToken, useCookies });
    return res.status(http_1.OK).json({
        status: 'success',
        data: {
            user,
        },
    });
});
// Facebook Sign-In
exports.facebookAuthHandler = (0, catchErrors_1.default)(async (req, res) => {
    const request = auth_schemas_1.facebookAuthSchema.parse({
        ...req.body,
        userAgent: req.headers["user-agent"],
    });
    const { user, accessToken, refreshToken } = await (0, auth_service_1.loginWithFacebook)(request);
    const useCookies = req.body.useCookies ?? false;
    (0, cookies_1.setAuthTokens)({ res, accessToken, refreshToken, useCookies });
    return res.status(http_1.OK).json({
        status: 'success',
        data: {
            user,
        },
    });
});
