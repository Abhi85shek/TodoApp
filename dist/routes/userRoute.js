"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controller/userController");
const router = (0, express_1.Router)();
router.post("/createUser", userController_1.createUserController);
router.post("/login", userController_1.login);
exports.default = router;
