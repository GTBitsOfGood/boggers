import { signIn, signOut } from "next-auth/react";

const Index = () => {
  return (
    <div>
      <button onClick={signIn}>sign in</button>
      <button onClick={signOut}>sign out</button>
    </div>
  );
};

export default Index;
