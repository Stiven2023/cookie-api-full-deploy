import Message from '../../models/Message.js';
import Chat from '../../models/Chat.js';
import { io } from '../../socketConfig.js';
import { uploadImage } from '../../cloudinary.js';
import jwt from 'jsonwebtoken';
import config from '../../config.js'
import User from '../../models/User.js';
import fs from 'fs-extra';

exports.createMessage = async (req, res) => {
  try {
    const token = req.headers['x-access-token'];
    const decoded = jwt.verify(token, config.secret);
    const userId = decoded.id;
    const { chatId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const sender = user._id;
    const { content } = req.body;

    const messageData = { sender };

    if (content) {
      messageData.content = content;
    }

    const message = new Message(messageData);

    if (req.files?.image) {
      const result = await uploadImage(req.files.image.tempFilePath);
      message.mediaUrl = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };
      await fs.unlink(req.files.image.tempFilePath);
    }

    await message.save();

    const chat = await Chat.findById(chatId);
    chat.messages.push(message);
    await chat.save();

    io.emit('newMessage', message, chatId);
    return res.status(201).json(message);
  } catch (error) {
    console.error("Error creating message:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

exports.getAllMessages = async (req, res) => {
  try {
    const token = req.headers['x-access-token'];
    const decodedToken = jwt.verify(token, config.secret);
    const userId = decodedToken.id;
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    if (!chat.participants.includes(userId)) {
      return res.status(403).json({ error: 'User does not belong to this chat' });
    }

    const messages = await Chat.findById(chatId).select('messages').populate('messages');

    res.json(messages);
  } catch (error) {
    console.error("Error getting all messages:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

exports.getMessageById = async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findById(messageId);
    if (message) {
      res.json(message);
    } else {
      res.status(404).json({ error: 'Message not found' });
    }
  } catch (error) {
    console.error("Error getting message by ID:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

exports.updateMessage = async (req, res) => {
  try {
    const token = req.headers['x-access-token'];
    const decoded = jwt.verify(token, config.secret);
    const userId = decoded.id;
    const { messageId } = req.params;
    const { content } = req.body;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.sender.toString() !== userId) {
      return res.status(403).json({ error: 'User not authorized to edit this message' });
    }

    message.content = content || message.content;
    await message.save();

    res.json(message);
  } catch (error) {
    console.error("Error updating message:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

exports.deleteMessage = async (req, res) => {
  try {
    const token = req.headers['x-access-token'];
    const decoded = jwt.verify(token, config.secret);
    const userId = decoded.id;
    const { messageId, chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.sender.toString() !== userId) {
      return res.status(403).json({ error: 'User not authorized to delete this message' });
    }

    if (!chat.messages.includes(messageId)) {
      return res.status(404).json({ error: 'Message does not belong to this chat' });
    }

    await Message.findByIdAndDelete(messageId);
    await Chat.findByIdAndUpdate(chatId, { $pull: { messages: messageId } });

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}