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

Index.title = "Boggers";

export default Index;
