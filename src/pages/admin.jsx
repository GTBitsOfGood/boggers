import Admin from "../screens/AdminDashboard";
import { getSession } from "next-auth/react";
import { baseAwsUrl } from "../server/utils/awsConfig";
import urls from "../server/utils/urls";

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: urls.pages.login,
        permanent: false,
      },
    };
  } else if (session.user.access < 1) {
    return {
      redirect: {
        destination: urls.pages.member,
        permanent: false,
      },
    };
  }

  return {
    props: { session, url: baseAwsUrl },
  };
}

export default Admin;
