import Login from "../screens/Login";
import connectMongo from "../server/mongodb/connectMongo";

export const getServerSideProps = async () => {
  await connectMongo();
  return { props: {} };
};

export default Login;
