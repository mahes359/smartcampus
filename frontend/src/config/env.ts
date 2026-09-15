export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? 'http://localhost:8080' : ''),
  APP_NAME: 'SmartCampus',
  VERSION: '1.0.0',
};
