import {getTests} from "../../server/mongodb/actions/Test";

export default async function handler(request, response) {
  if (request.method === "GET") {
    const tests = await getTests();
    return response.json({
      success: true,
      payload: {tests},
    });
  } else {
    response.status(404).json({
      success: false,
      message: "unknown endpoint",
    });
  }
}
