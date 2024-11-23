import mongoose from "mongoose"
import "dotenv/config";

export const connectToDatabase = async ():Promise<void>=>{

    try{
            if(!process.env.MONGODB_URL)
            {
                    throw new Error("MONGODB_URL is not defined in the Environment Variables.!")
            }

            await mongoose.connect(process.env.MONGODB_URL,{  dbName: 'TodoApp',});
            console.log("Connected to Database");

        }
        catch(err)
        {
            console.log("Failed to Connect to MongoDB",err);
            process.exit(1);
        }
}