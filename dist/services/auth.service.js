"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshUserAccessToken = exports.loginWithFacebook = exports.loginWithGoogle = exports.loginUser = exports.createAccount = exports.isPhoneVerified = exports.verifyPhoneCode = exports.requestPhoneVerification = void 0;
const http_1 = require("../constants/http");
const audience_1 = __importDefault(require("../constants/audience"));
const session_model_1 = __importDefault(require("../models/session.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const appAssert_1 = __importDefault(require("../utils/appAssert"));
const date_1 = require("../utils/date");
const jwt_1 = require("../utils/jwt");
const phoneSession_model_1 = __importDefault(require("../models/phoneSession.model"));
const crypto_1 = require("crypto");
const date_fns_1 = require("date-fns");
const google_auth_library_1 = require("google-auth-library");
const axios_1 = __importDefault(require("axios"));
// ========== PHONE SIGNUP ==========
const requestPhoneVerification = async (phone) => {
    const code = (0, crypto_1.randomInt)(0, 1000000).toString().padStart(6, '0');
    const expiresAt = (0, date_fns_1.addMinutes)(new Date(), 10);
    await phoneSession_model_1.default.findOneAndUpdate({ phone }, { phone, code, expiresAt, verified: false }, { upsert: true, new: true });
    //const message = `🔐 Your verification code is: ${code}`
    console.log(`Your verification code is: ${code}`);
    //await sendSMS(phone, message)
    return { phone, expiresAt, code };
};
exports.requestPhoneVerification = requestPhoneVerification;
const verifyPhoneCode = async (phone, code) => {
    const session = await phoneSession_model_1.default.findOne({ phone });
    (0, appAssert_1.default)(session, 400, 'Phone not found');
    (0, appAssert_1.default)(session.code === code, 400, 'Invalid code');
    (0, appAssert_1.default)(session.expiresAt > new Date(), 400, 'Code expired');
    session.verified = true;
    await session.save();
    const user = await user_model_1.default.findOne({ phone });
    (0, appAssert_1.default)(user, 401, 'Invalid credentials');
    return { verified: true, tokens: issueTokens(user) };
};
exports.verifyPhoneCode = verifyPhoneCode;
const isPhoneVerified = async (phone) => {
    const session = await phoneSession_model_1.default.findOne({ phone });
    return session?.verified === true;
};
exports.isPhoneVerified = isPhoneVerified;
// ========== LOCAL SIGNUP ==========
const createAccount = async ({ fullName, email, password, phone, role, birthDate, userAgent, }) => {
    (0, appAssert_1.default)(phone, 400, 'Phone number is required');
    const verified = await (0, exports.isPhoneVerified)(phone);
    (0, appAssert_1.default)(verified, 401, 'Phone number not verified');
    const existingUser = await user_model_1.default.exists({ email });
    (0, appAssert_1.default)(!existingUser, http_1.CONFLICT, 'Email already in use');
    const user = new user_model_1.default({
        fullName,
        email,
        password,
        role,
        birthDate,
        phone,
    });
    await user.save();
    return issueTokens(user, userAgent);
};
exports.createAccount = createAccount;
// ========== LOCAL LOGIN ==========
const loginUser = async ({ emailOrPhone, password, userAgent, }) => {
    const user = await user_model_1.default.findOne({
        $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });
    console.log("User response", user);
    (0, appAssert_1.default)(user, 401, 'Invalid credentials');
    const isValid = await user.comparePassword(password);
    console.log("Is valid", isValid);
    (0, appAssert_1.default)(isValid, http_1.UNAUTHORIZED, 'Invalid credentials');
    return issueTokens(user, userAgent);
};
exports.loginUser = loginUser;
// ========== GOOGLE SIGN-IN ==========
const loginWithGoogle = async ({ idToken, role, userAgent, }) => {
    const client = new google_auth_library_1.OAuth2Client(process.env.JWT_GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.JWT_GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    (0, appAssert_1.default)(payload, http_1.UNAUTHORIZED, 'Invalid Google token');
    (0, appAssert_1.default)(payload?.email, http_1.UNAUTHORIZED, 'Invalid Google token');
    let user = await user_model_1.default.findOne({ email: payload.email });
    // New user - register with Google
    if (!user) {
        (0, appAssert_1.default)(role, http_1.CONFLICT, 'New users must provide a role');
        user = await user_model_1.default.create({
            email: payload.email,
            fullName: payload.name || 'Unnamed User',
            role,
            password: Math.random().toString(36).slice(-10),
        });
    }
    return issueTokens(user, userAgent);
};
exports.loginWithGoogle = loginWithGoogle;
const loginWithFacebook = async ({ accessToken, role, userAgent, }) => {
    const fbResponse = await axios_1.default.get(`https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`);
    const profile = fbResponse.data;
    (0, appAssert_1.default)(profile?.email, 401, 'Facebook account must have a verified email');
    let user = await user_model_1.default.findOne({ email: profile.email });
    if (!user) {
        (0, appAssert_1.default)(role, 409, 'New users must provide a role');
        user = await user_model_1.default.create({
            email: profile.email,
            fullName: profile.name || 'Facebook User',
            password: Math.random().toString(36).slice(-10),
            role,
        });
    }
    return issueTokens(user, userAgent);
};
exports.loginWithFacebook = loginWithFacebook;
// ========== REFRESH TOKEN ==========
const refreshUserAccessToken = async (refreshToken) => {
    const { payload } = (0, jwt_1.verifyToken)(refreshToken, audience_1.default.User, {
        secret: jwt_1.defaultRefreshTokenOptions.secret,
    });
    (0, appAssert_1.default)(payload, http_1.UNAUTHORIZED, 'Invalid refresh token');
    const session = await session_model_1.default.findById(payload.sessionId);
    const now = Date.now();
    (0, appAssert_1.default)(session && session.expiresAt.getTime() > now, http_1.UNAUTHORIZED, 'Session expired');
    // Rotate refresh token if it's close to expiration
    const sessionNeedsRefresh = session.expiresAt.getTime() - now <= date_1.ONE_DAY_MS;
    if (sessionNeedsRefresh) {
        session.expiresAt = (0, date_1.thirtyDaysFromNow)();
        await session.save();
    }
    const newRefreshToken = sessionNeedsRefresh
        ? (0, jwt_1.signToken)({
            sessionId: session._id,
            aud: audience_1.default.User,
        }, jwt_1.defaultRefreshTokenOptions)
        : undefined;
    const accessToken = (0, jwt_1.signToken)({
        userId: session.userId,
        sessionId: session._id,
        role: session.userRole,
        aud: audience_1.default.User,
    });
    return {
        accessToken,
        newRefreshToken,
    };
};
exports.refreshUserAccessToken = refreshUserAccessToken;
// ========== TOKEN ISSUANCE SHARED ==========
const issueTokens = async (user, userAgent) => {
    const session = await session_model_1.default.create({
        userId: user._id,
        userAgent,
        userRole: user.role,
        expiresAt: (0, date_1.thirtyDaysFromNow)(),
    });
    const refreshPayload = {
        sessionId: session._id,
        aud: audience_1.default.User,
    };
    const accessPayload = {
        userId: user._id,
        sessionId: session._id,
        role: user.role,
        aud: audience_1.default.User,
    };
    const refreshToken = (0, jwt_1.signToken)(refreshPayload, jwt_1.defaultRefreshTokenOptions);
    const accessToken = (0, jwt_1.signToken)(accessPayload);
    return {
        user: user.omitPassword(),
        accessToken,
        refreshToken,
    };
};
