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
exports.connectToDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
const connectToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!process.env.MONGODB_URL) {
            throw new Error("MONGODB_URL is not defined in the Environment Variables.!");
        }
        yield mongoose_1.default.connect(process.env.MONGODB_URL, { dbName: 'TodoApp', });
        console.log("Connected to Database");
    }
    catch (err) {
        console.log("Failed to Connect to MongoDB", err);
        process.exit(1);
    }
});
exports.connectToDatabase = connectToDatabase;
