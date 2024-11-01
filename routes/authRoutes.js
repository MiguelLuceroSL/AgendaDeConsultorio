import express from 'express';
import { getRole, login, logout, register} from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/role', getRole);
router.post('/logout', logout);

export default router;