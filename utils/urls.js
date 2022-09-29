export default {
    base: 'http://localhost:3000',
    dbUrl: process.env.MONGO_DB ?? 'mongodb://localhost:27017',
    dbName: process.env.DB_NAME ?? 'local',
    pages: {
        index: '/',
        login: '/login'
    }
}