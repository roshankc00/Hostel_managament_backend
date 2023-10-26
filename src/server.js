import "dotenv/config";
import { app } from "./app/index.js";
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`iam running at the port ${PORT}`);
});
