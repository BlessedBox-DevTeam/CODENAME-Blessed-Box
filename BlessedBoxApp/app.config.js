console.log('App Environment:', process.env.APP_VARIANT);

const IS_PROD = process.env.APP_VARIANT === 'production';
const IS_DEW = process.env.APP_VARIANT === 'development';

const getUniqueIdentifier = () => {
  if (IS_PROD) {
    return 'com.kennepo23.blessedboxapp';
  }
  if (IS_DEW) {
    return 'com.kennepo23.blessedboxapp.dev';
  }
  return 'com.kennepo23.blessedboxapp.staging';
};

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
    bundleIdentifier: getUniqueIdentifier(),
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    edgeToEdgeEnabled: true,
    package: getUniqueIdentifier(),
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
    origin: false,
    EXPO_PUBLIC_URL: process.env.EXPO_PUBLIC_URL,
    EXPO_PUBLIC_PORT: process.env.EXPO_PUBLIC_PORT,
    eas: {
      projectId: 'c5861fad-066a-4c25-9240-ddabb311ac75',
    },
  },
  updates: {
    url: 'https://u.expo.dev/c5861fad-066a-4c25-9240-ddabb311ac75',
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
});
