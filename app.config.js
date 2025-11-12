import 'dotenv/config';

export default ({ config }) => {
  const APP_ENV = process.env.APP_ENV || 'development';

  return {
    ...config,
    owner: 'kennepo23',
    name: 'blessedboxapp',
    slug: 'blessedboxapp',
    version: '1.0.0',
    sdkVersion: '54.0.0',
    platforms: ['android', 'ios', 'web'],
    extra: {
      eas: {
        projectId: '04925fcb-f1be-4ab1-bca4-116c6f23d04c',
      },
      APP_ENV,
      URL: 'http://BlessedBox-LoadBalancer-187715699.us-east-2.elb.amazonaws.com',
      // URL: process.env.EXPO_PUBLIC_URL,
      PORT: 3000,
      // PORT: process.env.EXPO_PUBLIC_PORT,
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
