import express,{Express,Request,Response} from "express";
import { connectToDatabase } from "./db/db";
import "dotenv/config";
import userRoutes from "./routes/userRoute";
import refreshRoutes from "./routes/refreshRoute";
import authRoutes from "./routes/authRoute";
import cookieParser from "cookie-parser";
const PORT = process.env.PORT || 8000;

const app:Express = express();

app.use(express.json());

app.use(cookieParser())
// DataBase Connection
connectToDatabase();

app.use("/api/user",userRoutes);
app.use("/api/auth",authRoutes)
app.use("/refresh",refreshRoutes);





app.listen(PORT,()=>{
    console.log(`Listening on ${PORT}`);
})