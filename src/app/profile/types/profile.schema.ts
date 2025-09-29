import { z } from 'zod';

export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  phoneNumber: z
    .string()
    .refine(
      (val) => /^\+33[1-9]\d{8}$/.test(val),
      {
        message: 'Numéro de téléphone français invalide. Format attendu : +33XXXXXXXXX',
      }
    ),
});

export const passwordChangeSchema = z.object({
  newPassword: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: z.string().min(6, 'Confirmation requise'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword']
});

export const appSettingsSchema = z.object({
  locale: z.enum(['fr', 'en'], { message: 'Langue non supportée' }),
  notifications: z.boolean(),
  location: z.boolean(),
});

export type ProfileUpdateFormValues = z.infer<typeof profileUpdateSchema>;
export type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;
export type AppSettingsFormValues = z.infer<typeof appSettingsSchema>;

// User type based on Better Auth configuration
export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  birthday?: string;
  role: string;
  image?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSession {
  user: User;
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string;
    userAgent?: string;
  };
}

export interface AppSettings {
  locale: 'fr' | 'en';
  notifications: boolean;
  location: boolean;
}