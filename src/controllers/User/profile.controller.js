import User from '../../models/User.js'
import jwt from 'jsonwebtoken'
import config from '../../config.js'
import { uploadImage } from '../../cloudinary.js'
import sendChangePasswordEmail from '../../utils/emails/changePasswordEmail.js'
import fs from 'fs-extra'

exports.getProfile = async (req, res) => {
    try {
        const token = req.headers['x-access-token'];
        const decoded = jwt.verify(token, config.secret);
        const user = await User.findById(decoded.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const token = req.headers['x-access-token'];
        const decoded = jwt.verify(token, config.secret);

        const userId = decoded.id;
        const { username, email, password, fullname, gender, phone_number, description } = req.body;

        let updateFields = { username, email, password, fullname, gender, phone_number, description };

        if (req.files?.image) {
            const result = await uploadImage(req.files.image.tempFilePath)
            updateFields.image = {
                public_id: result.public_id,
                secure_url: result.secure_url
            }
            await fs.unlink(req.files.image.tempFilePath)
        }

        const user = await User.findByIdAndUpdate(userId, updateFields);
        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.changePassword = async (req, res) => {
    try {
        const token = req.headers['x-access-token'];
        const decoded = jwt.verify(token, config.secret);
        const user = await User.findById(decoded.id);
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Please provide both current and new password." });
        }

        const isMatch = await User.comparePassword(currentPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect." });
        }

        user.password = await User.encryptPassword(newPassword);
        await sendChangePasswordEmail(user.email, user.username)
        await user.save();

        res.status(200).json({ message: "Password changed successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
