import connectMongo from "../../server/utils/connectMongo";
import {signIn, signOut} from "next-auth/react";

const Index = () => {
  return (
    <div>
      <button onClick={signIn}>sign in</button>
      <button onClick={signOut}>sign out</button>
    </div>
  );
};
//Initializing mongo connection
export async function getServerSideProps() {
  if (!global.mongoose || !global.mongoose.db) {
    await connectMongo();
  }
  let isConnected = global.mongoose.db.connection.readyState == 1;
  return {props: {isConnected}};
}

export default Index;
