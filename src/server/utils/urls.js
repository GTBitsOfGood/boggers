const urls = {
  base: process.env.URL,
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
