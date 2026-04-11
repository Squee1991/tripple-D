import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.skillupgerman.app',
  appName: 'skillupgerman',
  webDir: '.output/public',
  plugins: {
    GoogleSignIn: {
      clientId: '516504654997-15ujeh34o8jc7hkbempel0t60qp0e43g.apps.googleusercontent.com',
    },
  },
};

export default config;