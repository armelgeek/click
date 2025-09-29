// Profile module exports
export { useProfile } from './hooks/use-profile';
export { usePasswordChange } from './hooks/use-password-change';
export { useAppSettings } from './hooks/use-app-settings';

export { profileApi } from './api/profile-api';

export type { 
  ProfileUpdateFormValues, 
  PasswordChangeFormValues, 
  AppSettingsFormValues,
  User,
  UserSession,
  AppSettings 
} from './types/profile.schema';

export { 
  profileUpdateSchema, 
  passwordChangeSchema, 
  appSettingsSchema 
} from './types/profile.schema';