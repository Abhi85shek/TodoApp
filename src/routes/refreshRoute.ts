import { Express,Router } from "express";
import { refreshTokenHandler } from "../controller/refreshTokenController";
const router = Router();


router.get("/",refreshTokenHandler);





export default router;