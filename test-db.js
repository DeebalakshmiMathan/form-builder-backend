import "dotenv/config";
import mongoose from "mongoose";

try {
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000
  });

  console.log("CONNECTED SUCCESSFULLY");
  await mongoose.disconnect();

} catch (error) {
  console.log("ERROR:", error.name);
  console.log("MESSAGE:", error.message);

  if (error.reason?.servers) {
    for (const [host, server] of error.reason.servers) {
      console.log("\nSERVER:", host);
      console.log("SERVER ERROR:", server.error?.message);
    }
  }
}