import 'dotenv/config';

export default ({ config }) => {
  const APP_ENV = process.env.APP_ENV || 'development';

  return {
    ...config,
    extra: {
      URL: APP_ENV === 'production' ? process.env.URL : process.env.URL,
      PORT: APP_ENV === 'production' ? process.env.PORT : process.env.PORT,
    },
  };
};
