export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/login",
      permanent: false,
    },
  };
}

Index.title = "Boggers";

const Index = () => {
  return <></>;
};

export default Index;
