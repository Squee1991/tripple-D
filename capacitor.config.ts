import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize } from '@capacitor/keyboard';

const config: CapacitorConfig = {
  appId: 'com.skillupgerman',
  appName: 'skillupgerman',
  webDir: '.output/public',
  plugins: {
    // StatusBar: {
    //   overlaysWebView: true,
    //   style: 'DARK',
    // },
    GoogleSignIn: {
      clientId: '516504654997-g3nt0plc6adh4jrvp55rn4p000t3qr09.apps.googleusercontent.com',
    },
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: '#0F172A',
    },
    AdMob: {
      androidAppId: 'ca-app-pub-7535671094319234~8726618547',
      iosAppId: 'ca-app-pub-7535671094319234~6499324694',
    },
    Keyboard: {
      resize: KeyboardResize.Native,
      resizeOnFullScreen: true
    },
  },
};

export default config;
