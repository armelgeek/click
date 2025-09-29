import { useState, useCallback } from 'react';
import { useSession } from '@/shared/config/auth.config';
import { ProfileUpdateFormValues } from '../types/profile.schema';

export function useProfile() {
  const { data: session } = useSession();
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const updateProfile = useCallback(async (data: ProfileUpdateFormValues) => {
    setIsUpdating(true);
    setUpdateError(null);

    try {
      console.log('Updating profile with:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      setUpdateError(errorMessage);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  return {
    user: session?.user || null,
    isLoading: false,
    error: null,
    updateProfile,
    isUpdating,
    updateError,
  };
}