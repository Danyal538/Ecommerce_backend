import express from "express"
import { getProfile, loginUser, logout, registerUser } from "../controllers/userController.js";
import authMiddleware from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/logout', logout);
userRouter.get('/profile', authMiddleware, getProfile)

export default userRouter;

