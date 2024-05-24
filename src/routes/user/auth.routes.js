import express from 'express';
import { signup, signin, logout, codeRecoverPassword, validateCode, changePassword } from '../../controllers/User/auth.controller.js';
import * as verifySignUp from '../../middlewares/verifySingup.js';


const router = express.Router();

router.post('/signup', verifySignUp.checkRoleExisted, signup);
router.post('/signin', signin);
router.post('/logout', logout);
router.post('/recover', codeRecoverPassword);
router.post('/validate', validateCode);
router.post('/changePassword', changePassword);



export default router;