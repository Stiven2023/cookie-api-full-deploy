import jwt from 'jsonwebtoken';
import config from '../config'
import User from '../models/User.js'
import Role from '../models/Role.js'

exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.headers['x-access-token'];

        if (!token) return res.status(403).json({ message: 'No token provided' });

        const decoded = jwt.verify(token, config.secret);
        req.userId = decoded.id;

        const user = await User.findById(req.userId, { password: 0 });
        if (!user) return res.status(404).json({ message: 'User not found' });

        next();
    } catch (error) {
        return res.status(500).json({ message: 'Unauthorized' });
    }
};

exports.isAdmin = async (req, res, next) => {
    const user = await User.findById(req.userId);
    const roles = await Role.find({ _id: { $in: user.role } });
    for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
            next();
            return;
        }
    }
    res.status(403).json({ message: 'Required Admin Role' });
};

exports.isModerator = async (req, res, next) => {
    const user = await User.findById(req.userId);
    const roles = await Role.find({ _id: { $in: user.role } });
    
    for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
            next();
            return;
        }
    }

    return res.status(403).json({ message: 'Required Moderator Role' });
};

exports.isUser = async (req, res, next) => {
    const user = await User.findById(req.userId);
    const roles = await Role.find({ _id: { $in: user.role } });
    
    for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "user") {
            next();
            return;
        }
    }

    return res.status(403).json({ message: 'Required User Role' });
};

exports.isModeratorOrAdmin = async (req, res, next) => {
    const user = await User.findById(req.userId);
    const roles = await Role.find({ _id: { $in: user.role } });
    for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator" || roles[i].name === "admin") {
            next();
            return;
        }
    }
    res.status(403).json({ message: 'Required Moderator or Admin Role' });
};