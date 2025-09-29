import { useState, useCallback, useEffect } from 'react';
import { profileApi } from '../api/profile-api';
import { AppSettings } from '../types/profile.schema';

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>({
    locale: 'fr',
    notifications: true,
    location: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const userSettings = profileApi.getUserSettings();
        setSettings(userSettings);
      } catch (err) {
        setError('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateSettings = useCallback(async (newSettings: Partial<AppSettings>) => {
    setIsSaving(true);
    setError(null);

    try {
      const updatedSettings = { ...settings, ...newSettings };
      await profileApi.saveUserSettings(updatedSettings);
      setSettings(updatedSettings);
      
      if (newSettings.locale) {
        document.documentElement.lang = newSettings.locale;
      }
      
      return updatedSettings;
    } catch (err) {
      setError('Failed to save settings');
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [settings]);

  const updateLocale = useCallback(async (locale: 'fr' | 'en') => {
    return updateSettings({ locale });
  }, [updateSettings]);

  const updateNotifications = useCallback(async (notifications: boolean) => {
    return updateSettings({ notifications });
  }, [updateSettings]);

  const updateLocation = useCallback(async (location: boolean) => {
    return updateSettings({ location });
  }, [updateSettings]);

  return {
    settings,
    isLoading,
    isSaving,
    error,
    updateSettings,
    updateLocale,
    updateNotifications,
    updateLocation,
  };
}