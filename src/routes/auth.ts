import express from 'express';
import { authController } from "../controllers";

const router = express.Router();

router.post('/signup', authController.signUp)
router.post('/login', authController.login)

export let authRouter = router;