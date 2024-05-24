import User from "../../models/User.js";
import sendDeleteEmail from "../../utils/emails/deleteEmail.js"
import sendUpdateStatusEmail from "../../utils/emails/updateStatusEmail.js"
import Jwt from "jsonwebtoken";
import Role from "../../models/Role.js"
import config from '../../config.js'
import { uploadImage } from '../../cloudinary.js'
import fs from 'fs-extra'

exports.createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const newUser = new User({
            username,
            email,
            password,
        })

        if (req.files?.image) {
            const result = await uploadImage(req.files.image.tempFilePath)
            newUser.image = {
                public_id: result.public_id,
                secure_url: result.secure_url
            }
            await fs.unlink(req.files.image.tempFilePath)
        }

        // if (req.files?.video) {
        //     const result = await uploadVideo(req.files.video.tempFilePath)
        //     newUser.video = {
        //         public_id: result.public_id,
        //         secure_url: result.secure_url
        //     }
        //     await fs.unlink(req.files.video.tempFilePath)
        // }

        await newUser.save();
        res.status(200).json({ message: "User created successfully" })
    } catch (error) {
        res.status(500).json(error)
    }
}

// Admin
exports.deleteUser = async (req, res) => { 
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        const { email, username } = user;

        await User.findByIdAndDelete(userId);
        await sendDeleteEmail(email, username)

        res.status(204).json("user delete successfully");
    } catch (error) {
        res.status(500).json({ error: "Error deleting user" });
    }
};

exports.changeRole = async (req, res) => { 
    try {
        const token = req.headers['x-access-token'];
        const decoded = Jwt.verify(token, config.secret);

        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: "Only admin can change user role" });
        }

        const { userId, roleId } = req.body;
        const userToChange = await User.findById(userId);

        if (!userToChange) {
            return res.status(404).json({ error: "User not found" });
        }

        const role = await Role.findById(roleId);

        if (!role) {
            return res.status(404).json({ error: "Role not found" });
        }

        userToChange.role = [role._id];
        await userToChange.save();

        res.status(200).json({ message: "User role changed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Moder or Admin
exports.getAllUsers = async (req, res) => {
    try {
        const token = req.headers['x-access-token'];
        const decoded = Jwt.verify(token, config.secret);

        // Obtén todos los usuarios excepto el que coincide con el ID del token
        const users = await User.find({ _id: { $ne: decoded.id } }).populate('role', 'name'); 

        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Error fetching users" });
    }
};


exports.getUsersById = async (req, res) => {
    try {
        const users = await User.findById(req.params.userId);

        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Error fetching user by id" });
    }

};

exports.getUsersByUsername = async (req, res) => {
    try {
        const {username} = req.body; 
        const user = await User.findOne({ username: username });

        if (!user) { 
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user); 
    } catch (error) {
        res.status(500).json({ error: "Error fetching user by username", message: error.message });
    }
};


exports.updateUser = async (req, res) => { 
    try {
        const { userId } = req.params;
        const { username, email, password, fullname, gender, phone_number, description } = req.body;

        await User.findByIdAndUpdate(userId, { username, email, password, fullname, gender, phone_number, description });

        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error updating user" });
    }
};

exports.updateStatus = async (req, res) => { 
    try {
        const { userId } = req.params;
        const { status } = req.body;

        await User.findByIdAndUpdate(userId, { status });
        await sendUpdateStatusEmail(email, username, status)

        res.status(200).json({ message: "User status updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error updating user status" });
    }
};


// User
exports.followUser = async (req, res) => { // user
    try {
        const token = req.headers['x-access-token'];
        const decoded = Jwt.verify(token, config.secret);

        const { userId } = req.params;
        const user = await User.findById(userId);
        const follower = await User.findById(decoded.id);

        if (!user || !follower) {
            return res.status(404).json({ message: 'User or follower not found.' })
        }
        
        if (user.followers.includes(decoded.id)) {
            return res.status(400).json({ message: 'You are already following this user.' });
        }

        user.followers.push(decoded.id);
        follower.following.push(userId);

        await user.save();
        await follower.save();

        res.json({ message: 'Follower added successfully.' });
    } catch (error) {
        res.status(500).json({ error: "Error following user" });
    }
}

exports.unfollowUser = async (req, res) => { // user
    try {
        const token = req.headers['x-access-token'];
        const decoded = Jwt.verify(token, config.secret);

        const { userId } = req.params;
        const user = await User.findById(userId);
        const follower = await User.findById(decoded.id);

        if (!user || !follower) {
            return res.status(404).json({ message: 'User or follower not found.' });
        }

        user.followers = user.followers.filter(follower => follower.toString() !== decoded.id);
        follower.following = follower.following.filter(user => user.toString() !== userId);

        await user.save();
        await follower.save();

        res.json({ message: 'Follower removed successfully.' });
    } catch (error) {
        res.status(500).json({ error: "Error unfollowing user" });
    }
}

exports.getFollowers = async (req, res) => {// user
    try {
        const users = await User.findById(req.params.userId);

        res.json(users.followers);
    } catch (error) {
        res.status(500).json({ error: "Error fetching followers" });
    }
};

exports.getFollowing = async (req, res) => {// user
    try {
        const users = await User.findById(req.params.userId);

        res.json(users.following);
    } catch (error) {
        res.status(500).json({ error: "Error fetching following" });
    }
};

exports.addFriend = async (req, res) => { // user
    try {
        const token = req.headers['x-access-token'];
        const decoded = Jwt.verify(token, config.secret);

        const { userId } = req.params;
        const user = await User.findById(userId);
        const friend = await User.findById(decoded.id);

        if (!user || !friend) {
            return res.status(404).json({ message: 'User or friend not found.' });
        }

        user.friends.push(decoded.id);
        friend.friends.push(userId);
        await friend.save();
        await user.save();

        res.json({ message: 'Friend added successfully.' });
    } catch (error) {
        res.status(500).json({ error: "Error adding friend" });
    }
};

exports.removeFriend = async (req, res) => { // user
    try {
        const token = req.headers['x-access-token'];
        const decoded = Jwt.verify(token, config.secret);

        const { userId } = req.params;
        const user = await User.findById(userId);
        const friend = await User.findById(decoded.id)

        if (!user || !friend) {
            return res.status(404).json({ message: 'User or friend not found.' });
        }

        user.friends = user.friends.filter(f => f.toString() !== decoded.id);
        friend.friends = friend.friends.filter(f => f.toString() !== userId);
        await user.save();
        await friend.save();

        res.json({ message: 'Friend removed successfully.' });
    } catch (error) {
        res.status(500).json({ error: "Error removing friend" });
    }
};

exports.getFriends = async (req, res) => {// user
    try {
        const users = await User.findById(req.params.userId);

        res.json(users.friends);
    } catch (error) {
        res.status(500).json({ error: "Error fetching friends" });
    }

};

exports.searchUsers = async (req, res) => {
    const { term } = req.body;
    const token = req.headers['x-access-token'];
    const decoded = Jwt.verify(token, config.secret);

    if (!term) {
        return res.status(400).json({ message: 'Falta término de búsqueda' });
    }

    try {
        const usuarios = await User.find({
            $and: [
                { _id: { $ne: decoded.id } },
                {
                    $or: [
                        { fullname: { $regex: term, $options: 'i' } },
                        { username: { $regex: term, $options: 'i' } }
                    ]
                }
            ]
        });

        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: "Error al buscar usuarios" })
    }
};