import { getToken } from "next-auth/jwt";
import { containerClient } from "../../server/utils/azureConfig";
import requestWrapper from "../../server/utils/middleware";
import { addImage } from "../../server/mongodb/actions/User";

async function handler(req, res) {
  const user = await getToken({ req });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  const { image, type } = req.body;

  try {
    const imageBuffer = new Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), "base64");
    const fileName = user.user.id;

    const blobClient = containerClient.getBlobClient(fileName);
    await blobClient.getBlockBlobClient().uploadData(imageBuffer, {
      blobHTTPHeaders: {
        blobContentType: type,
      },
    });

    await addImage(user.user.id);
    res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
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
