"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAuthCookies = exports.setAuthTokens = exports.getRefreshTokenCookieOptions = exports.getAccessTokenCookieOptions = exports.REFRESH_PATH = void 0;
const date_1 = require("./date");
exports.REFRESH_PATH = '/auth/refresh';
const defaults = {
    sameSite: 'strict',
    httpOnly: true,
    secure: true,
};
const getAccessTokenCookieOptions = () => ({
    ...defaults,
    expires: (0, date_1.fifteenMinutesFromNow)(),
});
exports.getAccessTokenCookieOptions = getAccessTokenCookieOptions;
const getRefreshTokenCookieOptions = () => ({
    ...defaults,
    expires: (0, date_1.thirtyDaysFromNow)(),
    path: exports.REFRESH_PATH,
});
exports.getRefreshTokenCookieOptions = getRefreshTokenCookieOptions;
const setAuthTokens = ({ res, accessToken, refreshToken, useCookies = false, }) => {
    if (useCookies) {
        res
            .cookie('accessToken', accessToken, (0, exports.getAccessTokenCookieOptions)())
            .cookie('refreshToken', refreshToken, (0, exports.getRefreshTokenCookieOptions)());
    }
    return res.status(200).json({
        status: 'success',
        data: {
            accessToken: useCookies ? undefined : accessToken,
            refreshToken: useCookies ? undefined : refreshToken,
        },
    });
};
exports.setAuthTokens = setAuthTokens;
const clearAuthCookies = (res) => res
    .clearCookie('accessToken')
    .clearCookie('refreshToken', { path: exports.REFRESH_PATH });
exports.clearAuthCookies = clearAuthCookies;
