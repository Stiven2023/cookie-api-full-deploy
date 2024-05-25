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
    const decodedToken = jwt.verify(token, config.secret);
    const userId = decodedToken.id;
    const { chatId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
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
    res.status(201).json(message);
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

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
    const messageId = req.params.id;
    const message = await MessageModel.findById(messageId);
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

// Actualizar un mensaje por su ID
exports.updateMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    const { sender, content, createdAt, chatId } = req.body;
    const updatedMessage = await MessageModel.findByIdAndUpdate(
      messageId,
      { sender, content, createdAt, chatId },
      { new: true }
    );
    if (updatedMessage) {
      res.json(updatedMessage);
    } else {
      res.status(404).json({ error: 'Message not found' });
    }
  } catch (error) {
    console.error("Error updating message:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Eliminar un mensaje por su ID
exports.deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    const deletedMessage = await MessageModel.findByIdAndDelete(messageId);
    if (deletedMessage) {
      // Eliminar el ID del mensaje del chat correspondiente
      await ChatModel.findByIdAndUpdate(deletedMessage.chatId, { $pull: { messages: messageId } });
      res.json({ message: 'Message deleted successfully' });
    } else {
      res.status(404).json({ error: 'Message not found' });
    }
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
