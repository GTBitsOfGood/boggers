const sendRequest = async (route, method, data = {}) => {
  let result;
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

  return result.json();
};

export default sendRequest;
