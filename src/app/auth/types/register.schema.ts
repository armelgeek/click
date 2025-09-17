import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  phone: z
    .string()
    .refine(
      (val) => /^\+33[1-9]\d{8}$/.test(val),
      {
        message: 'Numéro de téléphone français invalide. Format attendu : +33XXXXXXXXX',
      }
    ),
    birthday: z.string().min(8, 'La date de naissance est requise'),
  password: z.string().min(6, 'Mot de passe trop court'),
  confirmPassword: z.string().min(6, 'Confirmation requise'),
  terms: z.literal(true, { message: 'Vous devez accepter les conditions' })
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword']
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
