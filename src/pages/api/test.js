import { getTests } from "../../../server/mongodb/actions/Test.js";

const handler = async (request, response) => {
  if (request.method === "GET") {
    const tests = await getTests();
    response.json(tests);
  }
}

export default handler;