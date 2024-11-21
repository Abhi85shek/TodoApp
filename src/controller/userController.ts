import express,{NextFunction, Request,Response} from "express";
import UserSchema from "../models/User";
import {z} from "zod";


const userSchema = z.object({
    email:z.string().email({message:"Invalid Email Format"}),
    password : z.string().min(6,{message:"Password should be have at least 6 Characters"}),
    confirmPassword : z.string().min(6,{message:"Confirm Password should be have at least 6 Characters"}),
    age:z.number().int().positive({message:"Age should be Postive Number"}),
    firstName:z.string().min(1,{message:"First Name is required"}).max(30,{message:"FirstName is only be 30 Character Long"})
});


export const createUser = async (req:Request,res:Response) : Promise<void> =>{


    try{
        const validateData = userSchema.parse(req.body)
        
        const {email,password,age,firstName} = validateData;


        const UserCreated =  new UserSchema({email,password,age,firstName});

        await UserCreated.save();

        res.status(201).json({
            message:"User Successfully Created",
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