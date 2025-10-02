
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/shared/components/ui/input';
import { PasswordInput } from '@/components/atoms/password-input';
import { Button } from '@/shared/components/ui/button';
import { Switch } from '@/shared/components/ui/switch';
import { User, Lock, Settings, Bell, MapPin } from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useProfile } from '@/app/profile/hooks/use-profile';
import { usePasswordChange } from '@/app/profile/hooks/use-password-change';
import { useAppSettings } from '@/app/profile/hooks/use-app-settings';
import { useGeolocation } from '@/app/location';
import {
    profileUpdateSchema,
    passwordChangeSchema,
    ProfileUpdateFormValues,
    PasswordChangeFormValues
} from '@/app/profile/types/profile.schema';
export default function ProfileHomePage() {
    const { user, isLoading, updateProfile, isUpdating } = useProfile();
    const { changePassword, isChanging, canChangePassword } = usePasswordChange();
    const { settings, updateNotifications, updateLocation, isSaving } = useAppSettings();
    const { requestPermission, isPermissionGranted, isPermissionDenied, isSupported } = useGeolocation();

    const [toast, setToast] = useState<{ open: boolean; message: string; type: 'success' | 'error' }>({
        open: false,
        message: '',
        type: 'success'
    });
    const [showLocationInfoModal, setShowLocationInfoModal] = useState(false);

    const {
        control: profileControl,
        handleSubmit: handleProfileSubmit,
        formState: { errors: profileErrors },
        reset: resetProfile
    } = useForm<ProfileUpdateFormValues>({
        resolver: zodResolver(profileUpdateSchema),
        defaultValues: {
            name: '',
            email: '',
            phoneNumber: '',
        },
        mode: 'onChange',
    });

    useEffect(() => {
        if (user) {
            resetProfile({
                name: user.name || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
            });
        }
    }, [user, resetProfile]);

    const {
        control: passwordControl,
        handleSubmit: handlePasswordSubmit,
        formState: { errors: passwordErrors },
        reset: resetPassword
    } = useForm<PasswordChangeFormValues>({
        resolver: zodResolver(passwordChangeSchema),
        defaultValues: {
            newPassword: '',
            confirmPassword: '',
        },
        mode: 'onChange',
    });

    const onProfileSubmit = async (data: ProfileUpdateFormValues) => {
        try {
            await updateProfile(data);
            setToast({ open: true, message: 'Profil mis à jour avec succès', type: 'success' });
        } catch (error) {
            setToast({
                open: true,
                message: error instanceof Error ? error.message : 'Erreur lors de la mise à jour',
                type: 'error'
            });
        }
    };

    const onPasswordSubmit = async (data: PasswordChangeFormValues) => {
        try {
            await changePassword(data);
            resetPassword();
            setToast({ open: true, message: 'Mot de passe changé avec succès', type: 'success' });
        } catch (error) {
            setToast({
                open: true,
                message: error instanceof Error ? error.message : 'Erreur lors du changement de mot de passe',
                type: 'error'
            });
        }
    };


    const handleNotificationToggle = async (enabled: boolean) => {
        try {
            await updateNotifications(enabled);
        } catch (error) {
            setToast({ open: true, message: 'Erreur lors de la mise à jour des notifications', type: 'error' });
        }
    };

    const handleLocationToggle = async (enabled: boolean) => {
            if (enabled) {
                if (!isSupported) {
                    setToast({ open: true, message: "La géolocalisation n'est pas supportée par votre navigateur", type: 'error' });
                    await updateLocation(false);
                    return;
                }
                try {
                    await requestPermission();
                    if (isPermissionGranted) {
                        await updateLocation(true);
                        setToast({ open: true, message: "Localisation activée avec succès", type: 'success' });
                    } else {
                        setToast({ open: true, message: "Permission de localisation refusée", type: 'error' });
                        await updateLocation(false);
                    }
                } catch (error) {
                    setToast({ open: true, message: "Erreur lors de la demande de localisation", type: 'error' });
                    await updateLocation(false);
                }
            } else {
                await updateLocation(false);
                setShowLocationInfoModal(true);
            }
        };

    if (isLoading) {
        return (
            <div className="min-h-screen px-4 py-8 flex items-center justify-center">
                <div className="text-center">Chargement...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-4 py-8 flex flex-col gap-10">
            {showLocationInfoModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
                        <h2 className="text-lg font-bold mb-2 text-vapo-purple-primary">Désactivation complète de la localisation</h2>
                        <p className="mb-4 text-gray-700">La localisation est désactivée dans l'application.<br/>Pour retirer complètement la permission, allez dans les paramètres de votre navigateur (icône cadenas ou globe à côté de l'URL) et révoquez l'accès à la localisation pour ce site.</p>
                        <button className="mt-2 px-4 py-2 bg-vapo-purple-primary text-white rounded" onClick={() => setShowLocationInfoModal(false)}>J'ai compris</button>
                    </div>
                </div>
            )}
            {toast.open && (
                <div className={`fixed top-4 right-4 p-4 rounded-md ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white z-50`}>
                    {toast.message}
                    <button
                        onClick={() => setToast(prev => ({ ...prev, open: false }))}
                        className="ml-2 text-white hover:text-gray-200"
                    >
                        ×
                    </button>
                </div>
            )}

            <div>
                <div className="flex items-center gap-2 mb-4">
                    <User className="text-vapo-purple-primary w-6 h-6" />
                    <span className="text-vapo-purple-primary text-xl font-bold">Profil de l'utilisateur</span>
                </div>
                <form className="flex flex-col gap-6" onSubmit={handleProfileSubmit(onProfileSubmit)}>
                    <Controller
                        name="name"
                        control={profileControl}
                        render={({ field }) => (
                            <div>
                                <Input
                                    {...field}
                                    placeholder="John Doe"
                                    className="border border-gray-300  placeholder:text-gray-400"
                                />
                                {profileErrors.name && (
                                    <span className="text-red-500 text-xs mt-1">{profileErrors.name.message}</span>
                                )}
                            </div>
                        )}
                    />
                    <Controller
                        name="email"
                        control={profileControl}
                        render={({ field }) => (
                            <div>
                                <Input
                                    {...field}
                                    type="email"
                                    placeholder="johndoe@gmail.com"
                                    className="border border-gray-300 placeholder:text-gray-400"
                                />
                                {profileErrors.email && (
                                    <span className="text-red-500 text-xs mt-1">{profileErrors.email.message}</span>
                                )}
                            </div>
                        )}
                    />
                    <Controller
                        name="phoneNumber"
                        control={profileControl}
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
                                {profileErrors.phoneNumber && (
                                    <span className="text-red-500 text-xs mt-1">{profileErrors.phoneNumber.message}</span>
                                )}
                            </div>
                        )}
                    />
                    <div className="flex gap-4 mt-2">
                        <Button
                            variant="vapo"
                            className="flex-1"
                            type="submit"
                            disabled={isUpdating}
                        >
                            {isUpdating ? 'Enregistrement...' : 'Enregistrer la modification'}
                        </Button>
                        <Button
                            variant="vapo"
                            className="flex-1"
                            type="button"
                            onClick={() => resetProfile()}
                        >
                            Annuler
                        </Button>
                    </div>
                </form>
            </div>

            {canChangePassword && (
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Lock className="text-vapo-purple-primary w-6 h-6" />
                        <span className="text-vapo-purple-primary text-xl font-bold">Changer de mot de passe</span>
                    </div>
                    <form className="flex flex-col gap-6" onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
                        <Controller
                            name="newPassword"
                            control={passwordControl}
                            render={({ field }) => (
                                <div>
                                    <PasswordInput
                                        {...field}
                                        placeholder="Nouveau mot de passe"
                                        className="border border-gray-300 text-white placeholder:text-gray-400"
                                    />
                                    {passwordErrors.newPassword && (
                                        <span className="text-red-500 text-xs mt-1">{passwordErrors.newPassword.message}</span>
                                    )}
                                </div>
                            )}
                        />
                        <Controller
                            name="confirmPassword"
                            control={passwordControl}
                            render={({ field }) => (
                                <div>
                                    <PasswordInput
                                        {...field}
                                        placeholder="Retapez le nouveau mot de passe"
                                        className="border border-gray-300 text-white placeholder:text-gray-400"
                                    />
                                    {passwordErrors.confirmPassword && (
                                        <span className="text-red-500 text-xs mt-1">{passwordErrors.confirmPassword.message}</span>
                                    )}
                                </div>
                            )}
                        />
                        <div className="flex gap-4 mt-2">
                            <Button
                                variant="vapo"
                                className="flex-1"
                                type="submit"
                                disabled={isChanging}
                            >
                                {isChanging ? 'Changement...' : 'Changer le mot de passe'}
                            </Button>
                            <Button
                                variant="vapo"
                                className="flex-1"
                                type="button"
                                onClick={() => resetPassword()}
                            >
                                Annuler
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Settings className="text-vapo-purple-primary w-6 h-6" />
                    <span className="text-vapo-purple-primary text-xl font-bold">Paramètres de l'application</span>
                </div>
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <MapPin className="text-vapo-purple-primary w-5 h-5" />
                            <span className="text-base">Autoriser la localisation</span>
                        </div>
                        <Switch
                            checked={settings.location}
                            onCheckedChange={handleLocationToggle}
                            disabled={isSaving || isPermissionDenied || !isSupported}
                        />
                    </div>
                    {(isPermissionDenied || !isSupported) && (
                        <div className="text-xs text-red-500 mt-2 ml-7">
                            La localisation est bloquée par votre navigateur. <br />
                            Pour débloquer, allez dans les paramètres du navigateur (icône cadenas ou globe à côté de l’URL) et autorisez la localisation pour ce site.
                        </div>
                    )}
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bell className="text-vapo-purple-primary w-5 h-5" />
                            <span className="text-base">Autoriser la notification</span>
                        </div>
                        <Switch
                            checked={settings.notifications}
                            onCheckedChange={handleNotificationToggle}
                            disabled={isSaving}
                        />
                    </div>
                </div>
            </div>
              {showLocationInfoModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                    <h2 className="text-xl font-bold mb-2 text-vapo-purple-primary">Comment retirer la permission de localisation ?</h2>
                    <p className="mb-4 text-gray-700">
                        Pour désactiver la localisation, veuillez aller dans les paramètres de votre navigateur (icône cadenas ou globe à gauche de l’URL), puis retirer l’autorisation de localisation pour ce site.
                    </p>
                    <button
                        className="bg-vapo-purple-primary text-white px-4 py-2 rounded hover:bg-vapo-purple-dark w-full"
                        onClick={() => setShowLocationInfoModal(false)}
                    >
                        J'ai compris
                    </button>
                </div>
            </div>
        )}
        </div>
      
    );
}