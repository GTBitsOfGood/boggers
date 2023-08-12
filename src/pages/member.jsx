import Member from "../screens/Member";
import { getSession } from "next-auth/react";
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
  }

  return {
    props: { session },
  };
}

export default Member;
