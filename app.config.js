import 'dotenv/config';

export default ({ config }) => {
  const APP_ENV = process.env.APP_ENV || 'development';

  return {
    ...config,
    owner: 'kennepo23',
    name: 'blessedboxapp',
    slug: 'blessedboxapp',
    version: '1.0.0',
    platforms: ['android', 'ios', 'web'],
    extra: {
      eas: {
        projectId: '04925fcb-f1be-4ab1-bca4-116c6f23d04c',
      },
      APP_ENV,
      URL: process.env.EXPO_PUBLIC_URL,
      PORT: process.env.EXPO_PUBLIC_PORT,
    },
    updates: {
      url: 'https://u.expo.dev/04925fcb-f1be-4ab1-bca4-116c6f23d04c',
      enabled: true,
      checkAutomatically: 'ON_LOAD',
      fallbackToCacheTimeout: 0,
    },
    runtimeVersion: {
      policy: 'sdkVersion',
    },
    splash: {
      backgroundColor: '#F3B080',
    },
    android: {
      package: 'com.kennepo23.blessedboxapp',
      versionCode: 1,
      useCleartextTraffic: true,
    },
    ios: {
      bundleIdentifier: 'com.kennepo23.blessedboxapp',
      buildNumber: '1.0.0',
    },
    plugins: [
      [
        'expo-build-properties',
        {
          android: { usesCleartextTraffic: true },
        },
      ],
    ],
  };
};
