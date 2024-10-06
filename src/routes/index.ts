import { Router } from "express";
import { authController } from "../controllers";
import { authRouter } from "./auth";
import { subjectRouter } from "./subject";
import { adminJWT } from "../helper";
import { classesRouter } from "./classes";
import { userRouter } from "./user";

const router = Router()

router.use('/auth', authRouter)
router.use('/user', userRouter)

router.use(adminJWT)
router.use('/subject', subjectRouter)
router.use('/classes', classesRouter)

export default router