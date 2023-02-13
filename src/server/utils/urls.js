//fetch Vercel baseurl based on current status
function getBaseURL() {
  // if Deployement
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
    return `https://${process.env.NEXT_PUBLIC_URL}`;
  }
  // if Build Step
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "preview" || process.env.NEXT_PUBLIC_VERCEL_ENV === "development") {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  //if local
  return "http://localhost:3000";
}

const urls = {
  base: getBaseURL(),
  dbUrl: process.env.DB_URL ?? "mongodb://localhost:27017",
  dbName: process.env.DB_NAME ?? "local",
  emailId: process.env.NODEMAILER_EMAIL ?? "",
  nextAuthSecret: process.env.NEXTAUTH_SECRET ?? "",
  pages: {
    index: "/",
    login: "/login",
    admin: "/admin",
    member: "/member",
    emailVerification: "/email_verification",
    forgotPassword: "/forgot_password",
    resetPassword: "/reset_password",
  },
  api: {
    bulkUpload: "/api/bulk_upload",
    checkVerified: "/api/check_verified",
    deleteTenure: "/api/delete_tenure",
    deleteUser: "/api/delete_user",
    emailVerification: "/api/email_verification",
    forgotPassword: "/api/forgot_password",
    getUser: "/api/get_user",
    imageDelete: "/api/image_delete",
    imageUpload: "/api/image_upload",
    resetPassword: "/api/reset_password",
    updateMember: "/api/update_member",
  },
};

export default urls;
