export default {
    dbUrl: process.env.DB_URL,
    port: process.env.PORT || 4000,
    env: process.env.NODE_ENV || "dev",
    jwtSecrete: process.env.JWT_SECRETE,
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecreteAccessKey: process.env.AWS_SECRETE_ACCESS_KEY,
    awsBucketName: process.env.AWS_BUCKET_NAME,
};
