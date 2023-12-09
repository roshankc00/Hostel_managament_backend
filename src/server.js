import "dotenv/config";
import { app } from "./app/index.js";
import http from "http";
import { BlobServiceClient } from "@azure/storage-blob";
import { initSocketServer } from "./socket.js";
const PORT = process.env.PORT;
const server = http.createServer(app);
initSocketServer();

const AZURE_STORAGE_CONNECTION_STRING =
  process.env.AZURE_STORAGE_CONNECTION_STRING;

const blobServiceClient = BlobServiceClient.fromConnectionString(
  AZURE_STORAGE_CONNECTION_STRING
);

// console.log = console.warn = console.error = () => {};
server.listen(PORT, () => {
  console.log(`iam running at the port ${PORT}`);
});
