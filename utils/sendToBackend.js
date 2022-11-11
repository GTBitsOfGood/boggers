const sendRequest = async (route, method, data = {}) => {
  route = `/api/${route}`;

  let result;
  try {
    if (method === "GET") {
      result = await fetch(route);
    } else if (method === "POST" || method === "PUT") {
      result = await fetch(route, {
        method,
        body: JSON.stringify(data),
      });
    } else {
      console.log("Invalid Method");
    }

    return await result.json();
  } catch (error) {
    console.log(error);
  }
};

export default sendRequest;
