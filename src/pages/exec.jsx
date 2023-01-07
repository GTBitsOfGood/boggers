import Exec from "../screens/Exec";
import { getSession } from "next-auth/react";
import { baseAwsUrl } from "../server/utils/awsConfig";

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  } else if (session.user.access < 1) {
    return {
      redirect: {
        destination: "/members",
        permanent: false,
      },
    };
  }

  return {
    props: { session, url: baseAwsUrl },
  };
}

export default Exec;
