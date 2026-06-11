import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.skillupgerman.app',
  appName: 'skillupgerman',
  webDir: '.output/public',
  server: {
    url: 'http://192.168.178.21:3000',
    cleartext: true
  },
  backgroundColor: '#00000000',
  plugins: {
    StatusBar: {
      overlaysWebView: true,
      style: 'DARK',
    },
    GoogleSignIn: {
      clientId: '21366957409-oh0vp8d7dh9echqs2cvbsa5i4pcp68a3.apps.googleusercontent.com',
    },
    SplashScreen: {
      launchAutoHide: false,
      showSpinner: false,
    },
    AdMob: {
      androidAppId: 'ca-app-pub-3940256099942544~3347511713',
      iosAppId: 'ca-app-pub-3940256099942544~1458002511',
    },
  },
  android: {
    allowMixedContent: true,
    webContentsDebuggingEnabled: true,
  }
};

export default config;