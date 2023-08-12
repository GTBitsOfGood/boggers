import { getToken } from "next-auth/jwt";
import { containerClient } from "../../server/utils/azureConfig";
import requestWrapper from "../../server/utils/middleware";
import { deleteImage } from "../../server/mongodb/actions/User";

async function handler(req, res) {
  const user = await getToken({ req });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  let { id } = req.body;
  id = id ?? user.user.id;

  try {
    const blobClient = containerClient.getBlobClient(id);
    await blobClient.getBlockBlobClient().deleteIfExists();

    await deleteImage(id);
    res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error Deleting Image: " + err,
    });
  }
}

export default requestWrapper(handler, "DELETE");
