import { BlobServiceClient } from "@azure/storage-blob";
import fs from "fs";
import path from "path";
import ErrorHandler from "../utils/errorHandler.js";
import "dotenv/config";

export async function uploadImageInBulb(imagePath, next) {
  try {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const containerName = process.env.CONTAINER_NAME;
    const blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const blobName = path.basename(imagePath);

    const blobExists = await containerClient.getBlobClient(blobName).exists();
    if (blobExists) {
      return next(new ErrorHandler("blub with this name alreadhy exist", 400));
    }

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Upload image
    const data = fs.readFileSync(imagePath);
    await blockBlobClient.uploadFile(imagePath);

    const imageUrl = blockBlobClient.url;
    console.log(blobName, imageUrl);
    return {
      blobName,
      imageUrl,
    };
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
}

export async function deleteImageBulb(blubame) {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const containerName = "khojdau";
  const blobServiceClient =
    BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blubame);

  // Delete the blob
  await blockBlobClient.delete();

  console.log("Blob deleted successfully.");
}
