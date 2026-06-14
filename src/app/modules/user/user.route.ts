import express from 'express';
import { UserController } from './user.controller';
import auth from '../../../middlewares/auth';

const router = express.Router();

router.post('/create-user', UserController.createUser);
router.get('/my-profile', auth(), UserController.getMyProfile);

export const UserRoutes = router;