import { BlobServiceClient } from "@azure/storage-blob";

const { AZURE_CONNECTION_STRING, AZURE_CONTAINER_NAME, AZURE_STORAGE_URL } = process.env;
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_CONNECTION_STRING);
export const containerClient = blobServiceClient.getContainerClient(AZURE_CONTAINER_NAME);
export const baseAzureUrl = `${AZURE_STORAGE_URL}/${AZURE_CONTAINER_NAME}/`;
