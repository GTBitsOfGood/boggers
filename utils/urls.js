
function getBaseURL () {
    // if backend
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`
    }
    // if client-side
    if (process.env.NEXT_PUBLIC_VERCEL_URL) {
      return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    }
    return 'http://localhost:3000'
  }

export default {
    base: getBaseURL(),
    dbUrl: process.env.MONGO_DB ?? 'mongodb://localhost:27017',
    dbName: process.env.DB_NAME ?? 'local',
    pages: {
        index: '/',
        login: '/login'
    },
    api: {
        test: 'api/test',
        login: 'api/login',
        hello: 'api/hello'
    }
}