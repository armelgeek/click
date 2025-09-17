import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormValues } from '../types/login.schema';
import { signIn } from '@/shared/config/auth.config';
import { useNavigate } from 'react-router';
import { useState } from 'react';

export default function LoginForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
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
        mode: 'onChange',
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            setLoading(true);
            await signIn.email({
                email: data.email,
                password: data.password,
            });
            setLoading(false);
            navigate('/profile/home');
        } catch (e) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setError('email', { message: (e as any)?.message || 'Erreur lors de la connexion' });
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
                            <Input placeholder="Mot de passe" type="password" {...field} />
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
