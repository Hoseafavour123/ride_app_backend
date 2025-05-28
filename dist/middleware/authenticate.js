"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const authenticate = (audience) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res
                .status(401)
                .json({ status: 'error', message: 'Unauthorized: No token' });
        }
        const token = authHeader.split(' ')[1];
        const { payload, error } = (0, jwt_1.verifyToken)(token, audience);
        if (error || !payload) {
            return res
                .status(401)
                .json({ status: 'error', message: 'Invalid or expired token' });
        }
        req.user = {
            id: payload.userId,
            role: payload.role,
            sessionId: payload.sessionId,
        };
        next();
    };
};
exports.authenticate = authenticate;
