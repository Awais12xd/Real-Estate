import express from 'express';
import { authController, loginController , googleController , signOutController } from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/register" , authController)
router.post("/sign-in" , loginController)
router.post("/google" , googleController)
router.get("/sign-out", signOutController);

export default router;