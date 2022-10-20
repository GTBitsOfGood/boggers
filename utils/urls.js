//fetch Vercel baseurl based on current status
function getBaseURL() {
  // if Deployement
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // if Build Step
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  //if local
  return "http://localhost:3000";
}

export default {
  base: getBaseURL(),
  dbUrl: process.env.DB_URL ?? "mongodb://localhost:27017",
  dbName: "local",
  pages: {
    index: "/",
    login: "/login",
  },
  api: {
    test: "api/test",
    login: "api/login",
    hello: "api/hello",
  },
};
