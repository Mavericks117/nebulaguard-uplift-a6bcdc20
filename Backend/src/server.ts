import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import systemLogsRoute from "./routes/systemLogs";

dotenv.config();

const app = express();
app.use(cors());

app.use("/api", systemLogsRoute);

app.listen(process.env.PORT || 9000, () => {
  console.log("Backend running on port 9000");
});
