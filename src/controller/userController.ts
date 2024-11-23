import express,{NextFunction, Request,response,Response} from "express";
import UserSchema from "../models/User";
import bycrpt from "bcryptjs";
import {z} from "zod";
import "dotenv/config";
import User from "../models/User";
import jwt from "jsonwebtoken";


const accessToken = process.env.ACCESS_TOKEN;
const refreshToken = process.env.REFRESH_TOKEN;

if( !accessToken  || !refreshToken)
        {
            throw new Error("Refresh Token Not accessible");
        }
const userSchema = z.object({
    email:z.string().email({message:"Invalid Email Format"}),
    password : z.string().min(6,{message:"Password should be have at least 6 Characters"}),
    confirmPassword : z.string().min(6,{message:"Confirm Password should be have at least 6 Characters"}),
    age:z.number().int().positive({message:"Age should be Postive Number"}),
    firstName:z.string().min(1,{message:"First Name is required"}).max(30,{message:"FirstName is only be 30 Character Long"})
});

const emailValidate = z.string().email({message:"Invalid Email Format"});

export const createUserController = async (req:Request,res:Response) :Promise<void> =>{

    try{
        const validateData = userSchema.parse(req.body)
        const {email,password,age,firstName} = validateData;
        const checkDuplicate = await UserSchema.findOne({email});
        if(checkDuplicate)
        {
           res.status(400).json({
                message: "User already exists",
                success: false,
            });
        }
        
        const hashedPassword = await bycrpt.hash(password,10);
        const UserCreated =  new UserSchema({email,password:hashedPassword,age,firstName});
        const response = await UserCreated.save();
        res.status(201).json({
            message:"User Successfully Created",
            data:response,
            success:true
        })
        
    }
    catch(err)
    {
        if(err instanceof z.ZodError)
        {
           res.status(400).json({
                message: err.errors.map(e=>e.message).join(","),
                success:false
            })
        }
    console.error(err);
     res.status(500).json({
            message:err,
            success:false
        })
    }
};


export const login = async (req:Request,res:Response) : Promise<void> =>{

    try{
            const valdidateEmail = emailValidate.parse(req.body.email);
            const {password} = req.body;

            // Check the Email Exits or Not

            const UserExist = await UserSchema.findOne({email:valdidateEmail});

            if(!UserExist)
            {
              res.status(404).json({
                    message:"Email Not Found!",
                    success:false
                })
            }
            else {
            const verifyPassword = await bycrpt.compare(password,UserExist.password);
            if(!verifyPassword)
            {
               res.status(400).json({
                    message:"Incorrect Password",
                    success:false
                })
            }
            else
            {
                //  Creating JWT TOken Here and Then Send it.
                const access_token = jwt.sign({userId:UserExist.id},accessToken,{expiresIn:'30h'});
                const refresh_token = jwt.sign({userId:UserExist.id},refreshToken,{expiresIn:"1d"});

                console.log(valdidateEmail);
                const RefreshTokenInDB = await UserSchema.updateMany({email:valdidateEmail},{$set:{refreshToken:refresh_token}});
                console.log(RefreshTokenInDB);
                res.cookie('jwt',refresh_token,{httpOnly:true,maxAge:24 * 60 * 60 *1000});
                res.status(200).json({
                    messsage:'Login Successfull',
                    access_token:access_token,
                    success:true
                })
            }
        }     
    }
    catch(err)
        {
            console.error(err)
          res.status(500).json({
                messsage:"Internal Server Error",
                success:false
            })
        }


};

