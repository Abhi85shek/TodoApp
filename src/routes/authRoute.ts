import { Express,Router } from "express";
import { logoutHandler } from "../controller/authContoller";

const router  =Router();


router.get("/logout",logoutHandler)



export default router;