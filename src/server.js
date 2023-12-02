import "dotenv/config";
import { app } from "./app/index.js";
const PORT = process.env.PORT;
// console.log = console.warn = console.error = () => {};
app.listen(PORT, () => {
  console.log(`iam running at the port ${PORT}`);
});
