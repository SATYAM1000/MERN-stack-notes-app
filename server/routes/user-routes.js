import express from 'express';
import { registerUser,loginUser,getUserData } from '../controllers/user-controllers.js';
import authMiddleware from "../middleware/auth-middleware.js";
const userRouter=express.Router();
userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser);
userRouter.get('/user-data',authMiddleware,getUserData)

export default userRouter;