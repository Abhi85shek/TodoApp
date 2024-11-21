import express,{Request,Response} from "express";
import { connectToDatabase } from "./db/db";
import "dotenv/config";
import userRoutes from "./routes/userRoute";
const PORT = process.env.PORT || 8000;

const app = express();

app.use(express.json());
// DataBase Connection
connectToDatabase();

app.use("/api/user",userRoutes)






app.listen(PORT,()=>{
    console.log(`Listening on ${PORT}`);
})