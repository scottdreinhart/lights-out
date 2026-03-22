import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.scottreinhart.lightsout',
  appName: 'Lights Out',
  webDir: 'dist',
  
  /**
   * Common platform settings
   */
  plugins: {
    /**
     * StatusBar configuration (iOS/Android)
     */
    StatusBar: {
      style: 'dark', // 'light' or 'dark'
      backgroundColor: '#000000',
      overlaysWebView: false,
    },
    
    /**
     * Keyboard configuration (iOS/Android)
     */
    Keyboard: {
      resizeOnFullScreen: true,
    },

    /**
     * Splash screen configuration
     */
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: true,
      backgroundColor: '#000000',
      androidScaleType: 'center',
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#ffffff',
    },

    /**
     * App state tracking (detect foreground/background)
     */
    AppState: {},
  },

  /**
   * iOS specific configuration
   */
  ios: {
    contentInset: 'automatic', // 'automatic' or 'never'
    preferredContentMode: 'mobile', // 'mobile', 'desktop'
  },

  /**
   * Android specific configuration
   */
  android: {
    backgroundColor: '#000000',
  },

  /**
   * Web platform (for testing in browser dev mode)
   */
  server: {
    url: 'http://localhost:5173',
    cleartext: true,
  },
};

export default config;
