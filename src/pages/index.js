export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/login",
      permanent: false,
    },
  };
}

const Index = () => {
  return <></>;
};

export default Index;
