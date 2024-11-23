import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email:{
        required:true,
        type:String
    },
    password:{
        type:String,
        required:true
    },
    firstName:{
        type:String,
        required:true
    },
    age:{
        required:true,
        type:Number
    },
    refreshToken:{
        required:String
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
});


export default mongoose.model("User",UserSchema);