import "dotenv/config";
import { app } from "./app/index.js";
import http from "http";
import { initSocketServer } from "./socket.js";
const PORT = process.env.PORT;
const server = http.createServer(app);
initSocketServer();
// console.log = console.warn = console.error = () => {};
server.listen(PORT, () => {
  console.log(`iam running at the port ${PORT}`);
});
