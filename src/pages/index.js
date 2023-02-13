import { getSession } from "next-auth/react";
import urls from "../server/utils/urls";

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    redirect: {
      destination: session ? urls.pages.member : urls.pages.login,
      permanent: false,
    },
  };
}

const Index = () => {
  return <></>;
};

Index.title = "Boggers";

export default Index;
