import { useState, useCallback } from 'react';
import { socialSignIn } from '../api/social-auth';

export function useSocialAuth() {
  const [loading, setLoading] = useState(false);

  const signInWithProvider = useCallback(async (provider: 'google' | 'facebook' | 'x') => {
    setLoading(true);
    try {
      await socialSignIn(provider);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, signInWithProvider };
}
