import { Response,Request } from "express";
import UserSchema from "../models/User";
import jwt from "jsonwebtoken";


export const logoutHandler = async (req:Request,res:Response):Promise<void> => {

    const cookies = req.cookies;
    if(!cookies?.jwt) res.sendStatus(204);
    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;

    const foundUser = await UserSchema.find({refreshToken:refreshToken});
    console.log(foundUser);
    if(!foundUser)
            {
                res.clearCookie('jwt',{httpOnly:true});
                throw new Error("No Refresh Token Found");
            }

            const refresh_token = process.env.REFRESH_TOKEN;
    
            if(!refresh_token)
                    {
                        throw new Error("No Refresh Token Found");
                    }
        jwt.verify(refreshToken,refresh_token,async (err:any,decoded:any)=>{
            if(err)
            {
                res.sendStatus(403)
            }
            else
            {
                // Remove the Refresh Token from the Database

               const tokenRemove =  await UserSchema.updateOne({refreshToken},{$unset:{refreshToken:""}});
               console.log(tokenRemove);

                res.clearCookie('jwt',{httpOnly:true})

                res.sendStatus(204);
            }
        });


};