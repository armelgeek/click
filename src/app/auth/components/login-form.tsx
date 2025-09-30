import { Input } from '@/shared/components/ui/input';
import { PasswordInput } from '@/components/atoms/password-input';
import { Button } from '@/shared/components/ui/button';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormValues } from '../types/login.schema';
import { signIn } from '@/shared/config/auth.config';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function LoginForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { success, error: showErrorToast } = useToast();
    const {
        control,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onSubmit',
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            setLoading(true);
            
            const result = await signIn.email({
                email: data.email,
                password: data.password,
            });
            
            if (result?.data) {
                success('Connexion réussie !');
                setTimeout(() => {
                    navigate('/profile/home');
                }, 1000);
            } else {
                throw new Error('Erreur lors de la connexion');
            }
            
            
        } catch (e) {
            const error = e as { message?: string; code?: string };
            let errorMessage = 'Erreur lors de la connexion';
            
            if (error.message) {
                if (error.message.includes('Invalid credentials') || 
                    error.message.includes('invalid') || 
                    error.code === 'INVALID_CREDENTIALS') {
                    errorMessage = 'Email ou mot de passe incorrect';
                } else if (error.message.includes('User not found') || 
                          error.code === 'USER_NOT_FOUND') {
                    errorMessage = 'Aucun compte trouvé avec cet email';
                } else if (error.message.includes('Too many requests') || 
                          error.code === 'TOO_MANY_REQUESTS') {
                    errorMessage = 'Trop de tentatives. Veuillez réessayer plus tard';
                } else if (error.message.includes('Network') || 
                          error.code === 'NETWORK_ERROR') {
                    errorMessage = 'Erreur de réseau. Vérifiez votre connexion';
                } else {
                    errorMessage = error.message;
                }
            }
            
            showErrorToast(errorMessage);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="relative w-full max-w-sm">

            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <>
                            <Input placeholder="Email" type="email" {...field} />
                            {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
                        </>
                    )}
                />
                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                        <>
                            <PasswordInput placeholder="Mot de passe" {...field} />
                            {errors.password && <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>}
                        </>
                    )}
                />
                <Button variant="vapo" type="submit" className="mt-2 h-10" disabled={loading}>
                    {loading ? 'Connexion...' : 'Connexion'}
                </Button>
            </form>
        </div>
    );
}
