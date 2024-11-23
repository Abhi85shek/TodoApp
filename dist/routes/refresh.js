"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const refreshTokenController_1 = require("../controller/refreshTokenController");
const router = (0, express_1.Router)();
router.get("/", refreshTokenController_1.refreshTokenHandler);
exports.default = router;
