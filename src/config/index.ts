export default {
    dbUrl: process.env.DB_URL,
    port: process.env.PORT || 4000,
    env: process.env.NODE_ENV || "dev",
    jwtSecrete: process.env.JWT_SECRETE,
};
