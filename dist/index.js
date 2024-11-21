"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./db/db");
require("dotenv/config");
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const PORT = process.env.PORT || 8000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
// DataBase Connection
(0, db_1.connectToDatabase)();
app.use("/api/user", userRoute_1.default);
app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});
