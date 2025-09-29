import { useState, useCallback } from 'react';
import { socialSignIn } from '../api/social-auth';
import { useToast } from '@/hooks/use-toast';

export function useSocialAuth() {
  const [loading, setLoading] = useState(false);
  const { success, error: showErrorToast } = useToast();

  const signInWithProvider = useCallback(async (provider: 'google' | 'facebook' | 'x') => {
    setLoading(true);
    try {
      const result = await socialSignIn(provider);
      
      if (result?.data) {
        success(`Connexion réussie avec ${provider} !`);
      } else {
        throw new Error(`Erreur lors de la connexion avec ${provider}`);
      }
    } catch (error) {
      const err = error as { message?: string; code?: string };
      let errorMessage = `Erreur lors de la connexion avec ${provider}`;
      
      if (err.message) {
        if (err.message.includes('popup') || err.code === 'POPUP_BLOCKED') {
          errorMessage = 'Les popups sont bloquées. Veuillez autoriser les popups et réessayer';
        } else if (err.message.includes('cancelled') || err.code === 'USER_CANCELLED') {
          errorMessage = `Connexion avec ${provider} annulée`;
        } else if (err.message.includes('Network') || err.code === 'NETWORK_ERROR') {
          errorMessage = 'Erreur de réseau. Vérifiez votre connexion';
        } else {
          errorMessage = err.message;
        }
      }
      
      showErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [success, showErrorToast]);

  return { loading, signInWithProvider };
}
