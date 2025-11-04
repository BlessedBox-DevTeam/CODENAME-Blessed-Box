import 'dotenv/config';

const APP_ENV = process.env.APP_ENV || 'development';

export default ({ config }) => ({
  ...config,
  name: 'BlessedBoxApp',
  slug: 'BlessedBoxApp',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'blessedboxapp',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.kennepo23.blessedboxapp', // obligatorio
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    edgeToEdgeEnabled: true,
    package: 'com.kennepo23.blessedboxapp', // obligatorio
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
      },
    ],
  ],
  experiments: { typedRoutes: true },
  assetBundlePatterns: ['assets/fonts/*'],
  extra: {
    router: {},
    URL: APP_ENV === 'production' ? process.env.URL : process.env.URL,
    PORT: APP_ENV === 'production' ? process.env.PORT : process.env.PORT,
    eas: {
      projectId: 'c5861fad-066a-4c25-9240-ddabb311ac75', // obligatorio para EAS
    },
  },
  updates: {
    url: 'https://u.expo.dev/c5861fad-066a-4c25-9240-ddabb311ac75',
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
});
