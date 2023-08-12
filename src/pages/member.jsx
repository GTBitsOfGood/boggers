import Member from "../screens/Member";
import { getSession } from "next-auth/react";
import urls from "../server/utils/urls";

export async function getServerSideProps(context) {
  const session = await getSession(context);
  console.log(session);
  if (!session) {
    return {
      redirect: {
        destination: urls.pages.login,
        permanent: false,
      },
      props: {
        test: "failed",
      },
    };
  }

  return {
    props: { session },
  };
}

export default Member;
