import express from 'express';
import { createMessage, getAllMessages, getMessageById, updateMessage, deleteMessage } from '../../controllers/Chat/MessageController';

const router = express.Router();

router.post('/:chatId', createMessage);
router.get('/:chatId', getAllMessages);
router.get('/:id', getMessageById); 
router.put('/:id', updateMessage); 
router.delete('/:id', deleteMessage); 

export default router 