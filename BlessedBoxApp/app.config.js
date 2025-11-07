import 'dotenv/config';

export default ({ config }) => {
  const APP_ENV = process.env.APP_ENV || 'development';
  const PORT = process.env.EXPO_PUBLIC_PORT || '4000';
  const URL = process.env.EXPO_PUBLIC_URL || 'http://192.168.40.214';

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
        projectId: '6ab4cd27-c46d-4cc2-be7e-ebf6a3471209',
      },
      APP_ENV,
      PORT,
      URL,
    },
    updates: {
      url: 'https://u.expo.dev/6ab4cd27-c46d-4cc2-be7e-ebf6a3471209',
    },
    runtimeVersion: {
      policy: 'sdkVersion',
    },
    android: {
      package: 'com.kennepo23.blessedboxapp',
      versionCode: 1,
    },
    ios: {
      bundleIdentifier: 'com.kennepo23.blessedboxapp',
      buildNumber: '1.0.0',
    },
  };
};
