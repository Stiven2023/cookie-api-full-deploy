const mongoose = require('mongoose');
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    code: {
        type: String,
        default: ''
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    fullname: {
        type: String,
        default: ''
    },
    // avatar: {
    //     type: String,
    //     default: 'https://freesvg.org/img/abstract-user-flat-4.png'
    // },
    image: {
        public_id: String,
        secure_url: String
    },
    sesion : {
        type: String,
        default: ''
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'not binary'],
        default: 'male'
    },
    phone_number: {
        type: String,
        default: ''
    },
    // address: {
    //     type: String
    // },
    description: {
        type: String,
        default: ''
    },
    chats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    }],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
},
{
    timestamps: true,
    versionKey: false,
});

userSchema.statics.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

userSchema.statics.comparePassword = async (password, receivedPassword) => {
    return await bcrypt.compare(password, receivedPassword);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;