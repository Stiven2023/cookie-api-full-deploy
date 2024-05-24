import express from 'express';
import userController from '../../controllers/User/user.controller.js';
import { verifyToken, isUser, isAdmin, isModeratorOrAdmin } from '../../middlewares/authJwt.js';

const router = express.Router();

// Admin
router.delete('/:userId', [verifyToken, isAdmin], userController.deleteUser);
router.put('/changeRole', [verifyToken, isAdmin], userController.changeRole);

// Moder or Admin
router.get('/', [verifyToken, isModeratorOrAdmin], userController.getAllUsers);
router.post('/searchByUsername', [verifyToken, isModeratorOrAdmin], userController.getUsersByUsername);
router.put('/:userId', [verifyToken, isModeratorOrAdmin], userController.updateUser);
router.put('/status/:userId', [verifyToken, isModeratorOrAdmin], userController.updateStatus);


// User
router.get('/:userId', [verifyToken], userController.getUsersById);
router.post('/follow/:userId', [verifyToken, isUser], userController.followUser)
router.post('/unfollow/:userId', [verifyToken, isUser], userController.unfollowUser)
router.get('/followers/:userId', [verifyToken, isUser], userController.getFollowers)
router.get('/following/:userId', [verifyToken, isUser], userController.getFollowing)
router.post('/addFriend/:userId', [verifyToken, isUser], userController.addFriend)
router.post('/removeFriend/:userId', [verifyToken, isUser], userController.removeFriend)
router.get('/friends/:userId', [verifyToken, isUser], userController.getFriends)
router.post('/search', [verifyToken, isUser], userController.searchUsers)

router.post('/test', userController.createUser)

export default router;