"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const zod_1 = require("zod");
const userSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Invalid Email Format" }),
    password: zod_1.z.string().min(6, { message: "Password should be have at least 6 Characters" }),
    confirmPassword: zod_1.z.string().min(6, { message: "Confirm Password should be have at least 6 Characters" }),
    age: zod_1.z.number().int().positive({ message: "Age should be Postive Number" }),
    firstName: zod_1.z.string().min(1, { message: "First Name is required" }).max(30, { message: "FirstName is only be 30 Character Long" })
});
const createUser = async (req, res) => {
    try {
        const validateData = userSchema.parse(req.body);
        const { email, password, age, firstName } = validateData;
        const UserCreated = new User_1.default({ email, password, age, firstName });
        await UserCreated.save();
        res.status(201).json({
            message: "User Successfully Created",
            success: true
        });
    }
    catch (err) {
        if (err instanceof zod_1.z.ZodError) {
            res.status(400).json({
                message: err.errors.map(e => e.message).join(","),
                success: false
            });
        }
        console.error(err);
        res.status(500).json({
            message: err,
            success: false
        });
    }
};
exports.createUser = createUser;
