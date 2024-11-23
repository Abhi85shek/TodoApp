import {Router}   from "express";
import { createUserController, login } from "../controller/userController";

const router = Router();

router.post("/createUser",createUserController);
router.post("/login",login)

export default router;