import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.skillupgerman.app',
  appName: 'skillupgerman',
  webDir: '.output/public',
  server: {
    url: 'http://192.168.178.21:3000',
    cleartext: true
  },
  plugins: {
    StatusBar: {
      overlaysWebView: true,
      style: 'DARK',
    },
    GoogleSignIn: {
      clientId: '516504654997-15ujeh34o8jc7hkbempel0t60qp0e43g.apps.googleusercontent.com',
    },
    SplashScreen: {
      launchAutoHide: false,
      launchShowDuration: 3000
    },
  },
};

export default config;