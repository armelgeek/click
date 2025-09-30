import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormValues } from '../types/register.schema';
import { signUp } from '@/shared/config/auth.config';
import { useNavigate } from 'react-router';
import { Input } from '@/shared/components/ui/input';
import { PasswordInput } from '@/components/atoms/password-input';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Label } from '@/shared/components/ui/label';
import { LoadingSpinner } from '@/components/atoms/loading-spinner';
import { CUSTOMER_ROLE } from '@/shared/config/ common';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fr } from 'date-fns/locale';
import IdentityVerificationModal from '@/components/organisms/identity-verification-modal';

export default function RegisterForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showIdentityModal, setShowIdentityModal] = useState(false);
    const { success, error: showErrorToast } = useToast();
    const {
        control,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            birthday: '',
            password: '',
            confirmPassword: '',
            terms: true,
        },
        mode: 'onSubmit',
    });

    const onSubmit = async (data: RegisterFormValues) => {
        try {
            setLoading(true);
            const result = await signUp.email({
                name: data.name,
                email: data.email,
                phoneNumber: data.phone,
                birthday: data.birthday,
                role: CUSTOMER_ROLE,
                password: data.password,
            });
            if (result?.data) {
                success('Inscription réussie ! Vérification d\'identité requise');
                setShowIdentityModal(true);
            } else {
                throw new Error('Erreur lors de l\'inscription');
            }
        } catch (e) {
            const error = e as { message?: string; code?: string };
            let errorMessage = 'Erreur lors de l\'inscription';
            if (error.message) {
                if (error.message.includes('Failed to fetch') || 
                    error.code === 'NETWORK_ERROR') {
                    errorMessage = 'Impossible de se connecter au serveur. Vérifiez votre connexion internet';
                } else if (error.message.includes('email') && 
                          error.message.includes('already') ||
                          error.code === 'EMAIL_ALREADY_EXISTS') {
                    errorMessage = 'Cette adresse email est déjà utilisée';
                } else if (error.message.includes('validation') ||
                          error.code === 'VALIDATION_ERROR') {
                    errorMessage = 'Données invalides. Vérifiez vos informations';
                } else {
                    errorMessage = error.message;
                }
            }
            showErrorToast(errorMessage);
            setError('email', { message: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    // Bloque la navigation tant que le modal est ouvert
    // (utile si un effet ou un composant parent tente de naviguer)
    // On pourrait aussi utiliser un useEffect pour empêcher la navigation
    const handleVerificationSuccess = () => {
        setShowIdentityModal(false);
        success('Inscription et vérification d\'identité complétées avec succès !');
        setTimeout(() => {
            navigate('/profile/home');
        }, 2000);
    };

    const handleVerificationSkip = () => {
        setShowIdentityModal(false);
        success('Inscription réussie ! Vous pourrez vérifier votre identité plus tard');
        navigate('/profile/home');
    };

    return (
        <div className="relative w-full max-w-sm">
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <LoadingSpinner size={56} />
                </div>
            )}
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <>
                            <Input placeholder="Nom" {...field} />
                            {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>}
                        </>
                    )}
                />
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
                    name="phone"
                    control={control}
                    render={({ field }) => (
                        <div>
                            <PhoneInput
                                {...field}
                                defaultCountry="FR"
                                international
                                countryCallingCodeEditable={false}
                                className="mb-1 border border-gray-300 rounded-md px-3 py-2 w-full focus:border-vapo-purple-primary focus:ring-vapo-purple-primary/30"
                                placeholder="Numéro de téléphone (+33...)"
                            />
                            {errors.phone && <span className="text-red-500 text-xs mt-1">{errors.phone.message}</span>}
                        </div>
                    )}
                />
                <Controller
                    name="birthday"
                    control={control}
                    render={({ field }) => {
                        const value = field.value ? new Date(field.value) : null;
                        return (
                            <div className="flex flex-col">
                                <DatePicker
                                    selected={value}
                                    onChange={date => field.onChange(date ? date.toISOString().slice(0, 10) : '')}
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="Date de naissance"
                                    locale={fr}
                                    maxDate={new Date()}
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    className="mb-1 border border-gray-300 rounded-md px-3 py-2 w-full focus:border-vapo-purple-primary focus:ring-vapo-purple-primary/30"
                                />
                                {errors.birthday && <span className="text-red-500 text-xs mt-1">{errors.birthday.message}</span>}
                            </div>
                        );
                    }}
                />
                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                        <>
                            <PasswordInput placeholder="Nouveau mot de passe" {...field} />
                            {errors.password && <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>}
                        </>
                    )}
                />
                <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                        <>
                            <PasswordInput placeholder="Retapez le nouveau mot de passe" {...field} />
                            {errors.confirmPassword && <span className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</span>}
                        </>
                    )}
                />
                <Controller
                    name="terms"
                    control={control}
                    render={({ field }) => (
                        <div className="flex items-center gap-2 mt-2">
                            <Checkbox id="terms" checked={field.value} onCheckedChange={field.onChange} />
                            <Label htmlFor="terms">J'ai lu et accepte les <a href="/terms" className="text-blue-500 underline">conditions d'utilisation</a></Label>
                            {errors.terms && <span className="text-red-500 text-xs mt-1">{errors.terms.message}</span>}
                        </div>
                    )}
                />
                <Button variant="vapo" type="submit" className="mt-2 h-10" disabled={loading}>
                    {loading ? 'Inscription...' : 'Inscription'}
                </Button>
            </form>

            {/* Identity Verification Modal */}
            <IdentityVerificationModal
                open={showIdentityModal}
                onVerificationSuccess={handleVerificationSuccess}
                onSkip={handleVerificationSkip}
                onClose={() => setShowIdentityModal(false)}
            />
        </div>
    );
}
