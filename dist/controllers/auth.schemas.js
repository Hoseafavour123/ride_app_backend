"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.verificationCodeSchema = exports.registerSchema = exports.loginSchema = exports.facebookAuthSchema = exports.googleAuthSchema = exports.phoneVerifySchema = exports.phoneRequestSchema = exports.emailSchema = void 0;
const zod_1 = require("zod");
const user_model_1 = require("../models/user.model");
exports.emailSchema = zod_1.z.string().email().min(1).max(255);
const passwordSchema = zod_1.z.string().min(6).max(255);
exports.phoneRequestSchema = zod_1.z.object({
    phone: zod_1.z.string().min(10, 'Phone number is required'),
});
exports.phoneVerifySchema = zod_1.z.object({
    phone: zod_1.z.string().min(10),
    code: zod_1.z.string().length(4),
});
exports.googleAuthSchema = zod_1.z.object({
    idToken: zod_1.z.string().min(10, 'Invalid Google ID token'),
    role: zod_1.z.nativeEnum(user_model_1.UserRole).optional(), // Required only for first-time users
    userAgent: zod_1.z.string().optional(),
    useCookies: zod_1.z.boolean().optional(),
});
exports.facebookAuthSchema = zod_1.z.object({
    accessToken: zod_1.z.string().min(10, 'Invalid Facebook access token'),
    role: zod_1.z.nativeEnum(user_model_1.UserRole).optional(), // Required only for first-time users
    userAgent: zod_1.z.string().optional(),
    useCookies: zod_1.z.boolean().optional(),
});
exports.loginSchema = zod_1.z.object({
    emailOrPhone: zod_1.z.string().min(5, 'Email or phone is required'),
    password: zod_1.z.string().min(6),
    useCookies: zod_1.z.boolean().optional(),
    userAgent: zod_1.z.string().optional(),
});
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().min(5, 'Email is required'),
    password: zod_1.z.string().min(6),
    confirmPassword: passwordSchema,
    fullName: zod_1.z.string().min(1).max(255),
    phone: zod_1.z.string().optional(),
    birthDate: zod_1.z.date().optional(),
    role: zod_1.z.enum(["passenger", "driver", "admin"]),
    useCookies: zod_1.z.boolean().optional(),
    userAgent: zod_1.z.string().optional()
})
    .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
exports.verificationCodeSchema = zod_1.z.string().min(1).max(24);
exports.resetPasswordSchema = zod_1.z.object({
    password: passwordSchema,
    verificationCode: exports.verificationCodeSchema,
});
