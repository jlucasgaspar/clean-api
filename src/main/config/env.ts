export default {
    mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-node-api',
    port: process.env.PORT || 3030,
    jwtSecret: process.env.JWT_SECRET || 'vervbtnj_$5@ncje'
}