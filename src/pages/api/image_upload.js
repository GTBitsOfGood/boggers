import {getToken} from "next-auth/jwt";
import {s3, Bucket} from "../../../utils/awsConfig";
import requestWrapper from "../../../utils/middleware";

async function handler(req, res) {
  const user = await getToken({req});
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  const {name, image, type} = req.body;

  try {
    const result = await s3
      .upload({
        Bucket,
        Key: name,
        Body: new Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), "base64"),
        ContentType: type,
      })
      .promise();

    res.status(200).json({
      success: true,
      payload: {url: result.Location},
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error Uploading Image: " + err,
    });
  }
}

export default requestWrapper(handler, "PUT");

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};
