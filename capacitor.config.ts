import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.postica.baked',
  appName: 'Baked',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
