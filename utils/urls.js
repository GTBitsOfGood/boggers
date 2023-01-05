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

const urls = {
  base: getBaseURL(),
  dbUrl: process.env.DB_URL ?? "mongodb://localhost:27017",
  dbName: process.env.DB_NAME ?? "local",
  nextAuthSecret: process.env.NEXTAUTH_SECRET,
  pages: {
    index: "/",
    login: "/login",
    members: "/members",
    forgotPassword: "/ForgotPassword",
    exec: "/exec",
    resetPassword: "/reset_password",
  },
  api: {
    bulkUpload: "/api/bulk_upload",
    checkVerified: "/api/check_verified",
    forgotPassword: "/api/forgot_password",
    getUser: "/api/get_user",
    imageUpload: "/api/image_upload",
    resetPassword: "/api/reset_password",
    deleteUser: "/api/delete_user",
    deleteTenure: "/api/delete_tenure",
    updateMember: "/api/update_member",
  },
};

export default urls;
