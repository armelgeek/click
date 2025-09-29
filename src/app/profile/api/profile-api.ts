import { authClient } from '@/shared/config/auth.config';
import { ProfileUpdateFormValues, PasswordChangeFormValues } from '../types/profile.schema';

export const profileApi = {
  updateProfile: async (data: ProfileUpdateFormValues) => {
    const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/auth/update-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include', 
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    return response.json();
  },

  changePassword: async (data: PasswordChangeFormValues) => {
    return authClient.changePassword({
      newPassword: data.newPassword,
      currentPassword: '',
    });
  },

  isSocialAuth: (session: { user?: { accounts?: { providerId: string }[] } }) => {
    return session?.user?.accounts?.some((account: { providerId: string }) => 
      ['google', 'facebook', 'twitter', 'github'].includes(account.providerId)
    );
  },

  getUserSettings: () => {
    const settings = localStorage.getItem('user-app-settings');
    return settings ? JSON.parse(settings) : {
      locale: 'fr',
      notifications: true,
      location: false,
    };
  },

  saveUserSettings: (settings: { locale: string; notifications: boolean; location: boolean }) => {
    localStorage.setItem('user-app-settings', JSON.stringify(settings));
    return Promise.resolve(settings);
  },
};