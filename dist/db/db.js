"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
const connectToDatabase = async () => {
    try {
        if (!process.env.MONGODB_URL) {
            throw new Error("MONGODB_URL is not defined in the Environment Variables.!");
        }
        await mongoose_1.default.connect(process.env.MONGODB_URL);
        console.log("Connected to Database");
    }
    catch (err) {
        console.log("Failed to Connect to MongoDB", err);
        process.exit(1);
    }
};
exports.connectToDatabase = connectToDatabase;
