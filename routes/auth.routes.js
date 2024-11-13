import express from 'express';
import { getRole, login, logout, register, registerSecretaria} from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/registerSecretaria', registerSecretaria);
router.get('/role', getRole);
router.get('/logout', logout);

export default router;