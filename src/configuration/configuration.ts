export const configuration = () => ({
  server: {
    port: Number(process.env.PORT),
  },
  s3: {
    accesskey: process.env.AWS_S3_ACCESS_KEY,
    secretKey: process.env.AWS_S3_SECRET_KEY,
    bucket: process.env.AWS_S3_BUCKET,
    region: process.env.AWS_S3_REGION,
    endpoint: process.env.AWS_S3_ENDPOINT,
  },
  cognito: {
    userPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
    clientId: process.env.AWS_COGNITO_CLIENT_ID,
    region: process.env.AWS_COGNITO_REGION,
    authority: `${process.env.AWS_COGNITO_ENDPOINT}/${process.env.AWS_COGNITO_USER_POOL_ID}`,
    accessKey: process.env.AWS_COGNITO_ACCESS_KEY,
    secretKey: process.env.AWS_COGNITO_SECRET_KEY,
    endpoint: process.env.AWS_COGNITO_ENDPOINT,
  },
});
