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

const base = getBaseURL();
const dbUrl = process.env.DB_URL ?? "mongodb://localhost:27017";
const dbName = process.env.DB_NAME ?? "local";
const pages = {
  index: "/",
  login: "/login",
};
const api = {
  test: "api/test",
  login: "api/login",
  hello: "api/hello",
};

export {base, dbUrl, dbName, pages, api};
