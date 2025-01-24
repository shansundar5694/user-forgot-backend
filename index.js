import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./Database/dbconfig.js";
import userRouter from "./Routers/user.router.js";

dotenv.config();
const app = express();

const port = process.env.PORT;

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/user", userRouter);

app.listen(port, () => {
  console.log("app is running on", port);
});
