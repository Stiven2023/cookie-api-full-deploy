import { Router } from 'express'
import { getProfile, updateProfile, changePassword } from '../../controllers/User/profile.controller'
import { verifyToken, isUser } from '../../middlewares/authJwt'

const router = Router()

router.get('/', [verifyToken, isUser], getProfile)
router.put('/', [verifyToken], updateProfile)
router.put('/change-password', [verifyToken, isUser], changePassword)

export default router

