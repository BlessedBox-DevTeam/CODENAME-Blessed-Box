import 'dotenv/config';

/**
 * Define el entorno actual: development, production o staging.
 */
const ENV = process.env.APP_ENV || 'development';

/**
 * Configuración según el entorno.
 * Puedes cambiar las URLs, puertos y demás según necesites.
 */
const CONFIG = {
  development: {
    URL: process.env.URL || 'http://192.168.40.214',
    PORT: process.env.PORT || '3000',
    BUNDLE_ID: 'com.kennepo23.blessedboxapp.dev',
    PACKAGE_ID: 'com.kennepo23.blessedboxapp.dev',
  },
  staging: {
    URL: process.env.URL || 'https://staging-api.tudominio.com',
    PORT: process.env.PORT || '443',
    BUNDLE_ID: 'com.kennepo23.blessedboxapp.staging',
    PACKAGE_ID: 'com.kennepo23.blessedboxapp.staging',
  },
  production: {
    URL: process.env.URL || 'https://api.tudominio.com',
    PORT: process.env.PORT || '443',
    BUNDLE_ID: 'com.kennepo23.blessedboxapp',
    PACKAGE_ID: 'com.kennepo23.blessedboxapp',
  },
};

/**
 * Selecciona la config correcta según el entorno actual.
 */
const { URL, PORT, BUNDLE_ID, PACKAGE_ID } = CONFIG[ENV];

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
    bundleIdentifier: BUNDLE_ID,
  },

  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    edgeToEdgeEnabled: true,
    package: PACKAGE_ID,
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

  experiments: {
    typedRoutes: true,
  },

  assetBundlePatterns: ['assets/fonts/*'],

  extra: {
    env: ENV,
    URL,
    PORT,
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
