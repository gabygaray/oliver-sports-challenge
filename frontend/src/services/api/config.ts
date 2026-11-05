import { IAppConfig } from '../../utilities/appConfig.types';

export const config: IAppConfig = {
  apiUrl: import.meta.env.VITE_APP_API_BASE,
} as const;
