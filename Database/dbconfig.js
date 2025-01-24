import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoDbConnectionString = process.env.MONGODBCONNECTIONSTRING;
const connectDB = async () => {
  try {
    console.log("connstring", mongoDbConnectionString);
    const connection = await mongoose.connect(mongoDbConnectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connect to mongodb");
    return connection;
  } catch (error) {
    console.log(error);
  }
};
export default connectDB;
