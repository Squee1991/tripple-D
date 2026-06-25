import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize } from '@capacitor/keyboard';

const config: CapacitorConfig = {
  appId: 'com.skillupgerman.app',
  appName: 'skillupgerman',
  webDir: '.output/public',
  plugins: {
    // CapacitorHttp: {
    //   enabled: true,
    // },
    // server: {
    //   url: 'http://192.168.178.1:3000',
    //   cleartext: true
    // },
    // StatusBar: {
    //   overlaysWebView: true,
    //   style: 'DARK',
    // },
    GoogleSignIn: {
      clientId: '516504654997-g3nt0plc6adh4jrvp55rn4p000t3qr09.apps.googleusercontent.com',
    },
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 1500
    },
    AdMob: {
      androidAppId: 'ca-app-pub-3940256099942544~3347511713',
      iosAppId: 'ca-app-pub-3940256099942544~1458002511',
    },
    Keyboard: {
      resize: KeyboardResize.Native,
      resizeOnFullScreen: true
    },
  },
};

export default config;
