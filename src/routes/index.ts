import { Router } from "express";
import { authController } from "../controllers";
import { authRouter } from "./auth";

const router = Router()

router.use('/auth', authRouter)

export default router