import express from 'express';
import { AuthController } from './auth.controller';

const router = express.Router();

router.post('/register', AuthController.registerUser); 
router.post('/login', AuthController.loginUser);
router.post('/google-login', AuthController.googleLogin); 

export const AuthRoutes = router;