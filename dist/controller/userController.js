"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.createUserController = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const zod_1 = require("zod");
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const accessToken = process.env.ACCESS_TOKEN;
const refreshToken = process.env.REFRESH_TOKEN;
if (!accessToken || !refreshToken) {
    throw new Error("Refresh Token Not accessible");
}
const userSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Invalid Email Format" }),
    password: zod_1.z.string().min(6, { message: "Password should be have at least 6 Characters" }),
    confirmPassword: zod_1.z.string().min(6, { message: "Confirm Password should be have at least 6 Characters" }),
    age: zod_1.z.number().int().positive({ message: "Age should be Postive Number" }),
    firstName: zod_1.z.string().min(1, { message: "First Name is required" }).max(30, { message: "FirstName is only be 30 Character Long" })
});
const emailValidate = zod_1.z.string().email({ message: "Invalid Email Format" });
const createUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateData = userSchema.parse(req.body);
        const { email, password, age, firstName } = validateData;
        const checkDuplicate = yield User_1.default.findOne({ email });
        if (checkDuplicate) {
            res.status(400).json({
                message: "User already exists",
                success: false,
            });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const UserCreated = new User_1.default({ email, password: hashedPassword, age, firstName });
        const response = yield UserCreated.save();
        res.status(201).json({
            message: "User Successfully Created",
            data: response,
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
});
exports.createUserController = createUserController;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const valdidateEmail = emailValidate.parse(req.body.email);
        const { password } = req.body;
        // Check the Email Exits or Not
        const UserExist = yield User_1.default.findOne({ email: valdidateEmail });
        if (!UserExist) {
            res.status(404).json({
                message: "Email Not Found!",
                success: false
            });
        }
        else {
            const verifyPassword = yield bcryptjs_1.default.compare(password, UserExist.password);
            if (!verifyPassword) {
                res.status(400).json({
                    message: "Incorrect Password",
                    success: false
                });
            }
            else {
                //  Creating JWT TOken Here and Then Send it.
                const access_token = jsonwebtoken_1.default.sign({ userId: UserExist.id }, accessToken, { expiresIn: '30h' });
                const refresh_token = jsonwebtoken_1.default.sign({ userId: UserExist.id }, refreshToken, { expiresIn: "1d" });
                console.log(valdidateEmail);
                const RefreshTokenInDB = yield User_1.default.updateMany({ email: valdidateEmail }, { $set: { refreshToken: refresh_token } });
                console.log(RefreshTokenInDB);
                res.cookie('jwt', refresh_token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
                res.status(200).json({
                    messsage: 'Login Successfull',
                    access_token: access_token,
                    success: true
                });
            }
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            messsage: "Internal Server Error",
            success: false
        });
    }
});
exports.login = login;
