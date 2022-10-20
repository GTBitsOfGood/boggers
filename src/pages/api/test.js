import {getTests} from "../../server/mongodb/actions/Test";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const tests = await getTests();
    return res.json({
      success: true,
      payload: {tests},
    });
  } else {
    res.status(404).json({
      success: false,
      message: "unknown endpoint",
    });
  }
}
