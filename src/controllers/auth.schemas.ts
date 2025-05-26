import { z } from "zod";
import { UserRole } from '../models/user.model'


export const emailSchema = z.string().email().min(1).max(255);

const passwordSchema = z.string().min(6).max(255);


export const phoneRequestSchema = z.object({
  phone: z.string().min(10, 'Phone number is required'),
})

export const phoneVerifySchema = z.object({
  phone: z.string().min(10),
  code: z.string().length(4),
})


export const googleAuthSchema = z.object({
  idToken: z.string().min(10, 'Invalid Google ID token'),
  role: z.nativeEnum(UserRole).optional(), // Required only for first-time users
  userAgent: z.string().optional(),
  useCookies: z.boolean().optional(),
})

export const facebookAuthSchema = z.object({
  accessToken: z.string().min(10, 'Invalid Facebook access token'),
  role: z.nativeEnum(UserRole).optional(), // Required only for first-time users
  userAgent: z.string().optional(),
  useCookies: z.boolean().optional(),
});


export const loginSchema = z.object({
  emailOrPhone: z.string().min(5, 'Email or phone is required'),
  password: z.string().min(6),
  useCookies: z.boolean().optional(),
  userAgent: z.string().optional(),
})

export const registerSchema = z.object({
    email: z.string().min(5, 'Email is required'),
    password: z.string().min(6),
    confirmPassword: passwordSchema,
    fullName: z.string().min(1).max(255),
    phone: z.string().optional(),
    birthDate: z.date().optional(),
    role: z.enum(["passenger", "driver", "admin"]),
    useCookies: z.boolean().optional(),
    userAgent: z.string().optional()

  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const verificationCodeSchema = z.string().min(1).max(24);

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  verificationCode: verificationCodeSchema,
});
