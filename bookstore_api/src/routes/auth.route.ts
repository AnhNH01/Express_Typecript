import express from 'express';

export const authRouter = express.Router();

import * as authController from '../controllers/authController';

const {
    register,
    login
} = authController;


authRouter.post('/register', register);
authRouter.post('/login',login);


