import { useState, useEffect, useCallback } from 'react';

export interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: string | null;
  isLoading: boolean;
  isPermissionDenied: boolean;
  isPermissionGranted: boolean;
  isSupported: boolean;
}

export interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}


export function useGeolocation(options: GeolocationOptions = {}) {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    isLoading: false,
    isPermissionDenied: false,
    isPermissionGranted: false,
    isSupported: typeof navigator !== 'undefined' && 'geolocation' in navigator,
  });

  const defaultOptions: GeolocationOptions = {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 0,
    ...options,
  };

  const checkPermission = useCallback(async () => {
    if (!state.isSupported) {
      setState(prev => ({ 
        ...prev, 
        error: 'Géolocalisation non supportée par ce navigateur',
        isPermissionDenied: true 
      }));
      return;
    }

    try {
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        
        if (permission.state === 'denied') {
          setState(prev => ({ 
            ...prev, 
            isPermissionDenied: true,
            isPermissionGranted: false,
            error: 'Autorisation de localisation refusée' 
          }));
          return;
        }
        
        if (permission.state === 'granted') {
          setState(prev => ({ 
            ...prev, 
            isPermissionGranted: true,
            isPermissionDenied: false,
            error: null 
          }));
        }
      }
    } catch (error) {
      console.warn('Permission API not available:', error);
    }
  }, [state.isSupported]);

  const getCurrentPosition = useCallback(() => {
    if (!state.isSupported) {
      setState(prev => ({ 
        ...prev, 
        error: 'Géolocalisation non supportée par ce navigateur' 
      }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          isLoading: false,
          isPermissionGranted: true,
          isPermissionDenied: false,
          error: null,
        }));
      },
      (error) => {
        let errorMessage = 'Erreur de géolocalisation';
        let isPermissionDenied = false;

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Autorisation de localisation refusée par l\'utilisateur';
            isPermissionDenied = true;
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Position géographique non disponible';
            break;
          case error.TIMEOUT:
            errorMessage = 'Délai d\'attente dépassé pour obtenir la position';
            break;
          default:
            errorMessage = 'Erreur inconnue lors de la géolocalisation';
            break;
        }

        setState(prev => ({
          ...prev,
          error: errorMessage,
          isLoading: false,
          isPermissionDenied,
          isPermissionGranted: !isPermissionDenied,
        }));
      },
      defaultOptions
    );
  }, [state.isSupported, defaultOptions]);

  const requestPermission = useCallback(async () => {
    await checkPermission();
    if (!state.isPermissionDenied) {
      getCurrentPosition();
    }
  }, [checkPermission, getCurrentPosition, state.isPermissionDenied]);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  const shouldShowDegradedMode = state.isPermissionDenied || !state.isSupported || !!state.error;

  return {
    ...state,
    getCurrentPosition,
    requestPermission,
    shouldShowDegradedMode,
    hasPosition: state.latitude !== null && state.longitude !== null,
  };
}