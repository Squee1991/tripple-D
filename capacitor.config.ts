import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize } from '@capacitor/keyboard';

const config: CapacitorConfig = {
  appId: 'com.skillupgerman.app',
  appName: 'skillupgerman',
  webDir: '.output/public',
  plugins: {
    GoogleSignIn: {
      clientId: '516504654997-g3nt0plc6adh4jrvp55rn4p000t3qr09.apps.googleusercontent.com',
    },
    SplashScreen: {
      // Пока сплэш висит, окно приложения не нарисовано и не в фокусе: тап в это время дольше 5 с = ANR
      // "No focused window". Поэтому сплэш сам уходит через 2 с, даже если JS на слабом телефоне ещё грузится
      launchAutoHide: true,
      launchShowDuration: 2000
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
