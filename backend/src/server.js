import "dotenv/config";   // enough, no need for dotenv.config()

import app from "./app.js";
import connectDB from "./config/db.js";

const port = process.env.PORT || 5000;

await connectDB();

app.listen(port, () => {
  console.log(`AIML Activity Portal API running on port ${port}`);
});