import { Response,Request } from "express";
import UserSchema from "../models/User";
import jwt from "jsonwebtoken";

export const refreshTokenHandler = async (req:Request,res:Response) :Promise<void>=>{

    try{
    const cookies =req.cookies;
   
    if(!cookies?.jwt)
    {
           res.sendStatus(401);
    }

    const refreshToken = cookies.jwt;

   
    const FoundUser = UserSchema.find({refreshToken});

    if(!FoundUser)
    {
       res.sendStatus(403)  //ForBidden means 
    }

    const refresh_token = process.env.REFRESH_TOKEN;
    
    if(!refresh_token)
            {
                throw new Error("No Refresh Token Found");
            }
    jwt.verify(refreshToken,refresh_token,(err:any,decoded:any)=>{
        if(err)
        {
            return res.sendStatus(403);
        }

        const access_token = process.env.ACCESS_TOKEN;
    
        if(!access_token)
                {
                    throw new Error("No Refresh Token Found");
                }
        const accessToken = jwt.sign({userId:decoded.id},access_token,{expiresIn:'1h'});

      
        return res.status(200).json({
            accessToken
        })
    });
}
catch(err)
{
    res.sendStatus(403).json({
        success:false,
        message:err
    })
}

};