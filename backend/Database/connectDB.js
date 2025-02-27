import { Console } from "console";
import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const  connection = await mongoose.connect(process.env.MONGO)
        console.log("mongoDB connected successfully", connection.connection.host)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
  
    
}