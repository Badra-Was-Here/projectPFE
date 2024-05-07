import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connection sucess !!!!");
  } catch (error) {
    console.log("eroro in connection");
    console.log(error);
  }
};
export default connectMongoDB;
