import { S3 } from "aws-sdk";

const config = {
  region: process.env.BUCKET_REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  signatureVersion: "v4",
};

export const s3 = new S3(config);
export const Bucket = process.env.BUCKET_NAME;
export const baseAwsUrl = `https://${Bucket}.s3.${config.region}.amazonaws.com/`;
