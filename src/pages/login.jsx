import Login from "../screens/Login";
import connectMongo from "../server/mongodb/connectMongo";
import { getSession } from "next-auth/react";
import urls from "../server/utils/urls";

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session) {
    return {
      redirect: {
        destination: urls.pages.member,
        permanent: false,
      },
    };
  }

  connectMongo();
  return { props: {} };
};

export default Login;
