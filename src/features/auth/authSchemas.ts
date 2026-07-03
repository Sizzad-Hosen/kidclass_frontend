import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Student name must be at least 2 characters."),
  email: z.email("Enter a valid parent email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  role: z.enum(["student", "admin"]),
  classLevel: z.string().min(1, "Choose a class."),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email address."),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string().min(6, "Confirm your new password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
