import express from "express";

export const authRouter = express.Router();

import * as authController from "../controllers/authController";

const { register, login, adminLogin, adminRegister } = authController;

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/admin/register", adminRegister);
authRouter.post("/admin/login", adminLogin);
