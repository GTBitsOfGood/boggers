import {S3} from "aws-sdk";

export const s3 = new S3({
  region: process.env.BUCKET_REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  signatureVersion: "v4",
});

export const Bucket = process.env.BUCKET_NAME;
