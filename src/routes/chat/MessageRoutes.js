import express from 'express';
import { createMessage, getAllMessages, getMessageById, updateMessage, deleteMessage } from '../../controllers/Chat/MessageController';

const router = express.Router();

router.post('/:chatId/messages', createMessage);
router.get('/:chatId/messages', getAllMessages);
router.get('/:chatId/messages/:messageId', getMessageById);
router.put('/:chatId/messages/:messageId', updateMessage);
router.delete('/:chatId/messages/:messageId', deleteMessage);

export default router 