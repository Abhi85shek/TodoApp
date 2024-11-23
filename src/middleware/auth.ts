import { Express,NextFunction,Request,Response } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

declare global {
    namespace Express {
      interface Request {
        user?: string; // Adjust type as per your needs
      }
    }
  }

const verifyToken = async (req:Request,res:Response,next:NextFunction):Promise<void> =>{

    const authHeader = req.headers['authorization'];
    if(!authHeader)
    {
        throw new Error("Unauthorized");
    }
    console.log(authHeader);
    const token = authHeader.split(' ')[1];
    const secret = process.env.ACCESS_TOKEN;
    if(!secret)
            {
                throw new Error("Access Token is Not Defined in the ENV File");
            }
    jwt.verify(
        token,
        secret,
        (err:any,decoded:any)=>{
            if(err) throw new Error("Invalid Token")
                req.user  = decoded.email
                 next();
           
        }
        
    )

};