import { useState, useCallback } from 'react';
import { PasswordChangeFormValues } from '../types/profile.schema';

export function usePasswordChange() {
  const [isChanging, setIsChanging] = useState(false);
  const [changeError, setChangeError] = useState<string | null>(null);

  const isSocialAuth = false;

  const changePassword = useCallback(async (data: PasswordChangeFormValues) => {
    if (isSocialAuth) {
      throw new Error('Cannot change password for social authentication');
    }

    setIsChanging(true);
    setChangeError(null);

    try {
      console.log('Changing password with data:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to change password';
      setChangeError(errorMessage);
      throw error;
    } finally {
      setIsChanging(false);
    }
  }, [isSocialAuth]);

  return {
    changePassword,
    isChanging,
    changeError,
    isSocialAuth,
    canChangePassword: !isSocialAuth,
  };
}