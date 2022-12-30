import Exec from "../screens/Exec";
import {getSession} from "next-auth/react";

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
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
    props: {session},
  };
}

export default Exec;
