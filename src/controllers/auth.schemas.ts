import { z } from "zod";
import { UserRole } from '../models/user.model'


export const emailSchema = z.string().email().min(1).max(255);

const passwordSchema = z.string().min(6).max(255);


export const googleAuthSchema = z.object({
  idToken: z.string().min(10, 'Invalid Google ID token'),
  role: z.nativeEnum(UserRole).optional(), // Required only for first-time users
  userAgent: z.string().optional(),
  useCookies: z.boolean().optional(),
})


export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  userAgent: z.string().optional(),
});

export const registerSchema = loginSchema
  .extend({
    confirmPassword: passwordSchema,
    fullName: z.string().min(1).max(255),
    phone: z.string().optional(),
    role: z.enum(["passenger", "driver", "admin"]),

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
