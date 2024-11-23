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
exports.refreshTokenHandler = void 0;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const refreshTokenHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt)) {
        res.sendStatus(401);
    }
    const refreshToken = cookies.jwt;
    const FoundUser = User_1.default.find({ refreshToken });
    if (!FoundUser) {
        res.sendStatus(403); //ForBidden means 
    }
    const refresh_token = process.env.REFRESH_TOKEN;
    if (!refresh_token) {
        throw new Error("No Refresh Token Found");
    }
    jsonwebtoken_1.default.verify(refreshToken, refresh_token, (err, decoded) => {
        if (err) {
            return res.sendStatus(403);
        }
        const access_token = process.env.ACCESS_TOKEN;
        if (!access_token) {
            return res.sendStatus(403);
        }
        const accessToken = jsonwebtoken_1.default.sign({ userId: decoded.id }, access_token, { expiresIn: '1h' });
        return res.sendStatus(200).json({
            accessToken
        });
    });
});
exports.refreshTokenHandler = refreshTokenHandler;
