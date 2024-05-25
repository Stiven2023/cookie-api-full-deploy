import User from "../../models/User.js";
import jwt from 'jsonwebtoken';
import config from '../../config.js';
import Role from "../../models/Role.js";
import sendSignUpEmail from "../../utils/emails/signupEmail.js"
import sendSignInEmail from "../../utils/emails/signinEmail.js"
import sendCodeRecoverEmail from '../../utils/emails/codeEmail.js'
import sendChangePasswordEmail from '../../utils/emails/changePasswordEmail.js'
import { validateRegister, validateLogin } from '../../middlewares/validateAuth.js'

exports.signup = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        try {
            await validateRegister(username, email, password);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }

        const newUser = new User({
            username,
            email,
            password: await User.encryptPassword(password),
            role,
        });

        if (role) {
            const foundRoles = await Role.find({ name: { $in: role } });
            newUser.role = foundRoles.map(role => role._id);
        } else {
            const role = await Role.findOne({ name: "user" });
            newUser.role = [role._id];
        }

        const savedUser = await newUser.save();
        console.log(savedUser);

        const token = jwt.sign({ id: savedUser._id }, config.secret, {
            expiresIn: 86400
        });

        await sendSignUpEmail(email, username)

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.signin = async (req, res) => {
    try {
        const { emailOrUsername, password } = req.body;

        try {
            await validateLogin(emailOrUsername, password);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }

        if (!emailOrUsername || !password) {
            return res.status(400).json({ message: "Please provide both email and password or username and password." });
        }

        let userFound = await User.findOne({ email: emailOrUsername }).populate("role");

        if (!userFound) {
            userFound = await User.findOne({ username: emailOrUsername }).populate("role");
        }

        if (!userFound) {
            return res.status(404).json({ message: "Email or username not found." });
        }

        if (userFound.status === 'inactive') {
            return res.status(403).json({ message: "User is inactive. Please contact the administrator." });
        }

        // if (userFound.sesion === 'true') {
        //     return res.status(403).json({ message: "User is already logged in." });
        // }

        const token = jwt.sign({ id: userFound._id, role: userFound.role.name, username: userFound.username, fullname: userFound.fullname, image: userFound.image }, config.secret);

        // userFound.sesion = true;
        await userFound.save();

        console.log(userFound);
        await sendSignInEmail(userFound.email, userFound.username);
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.logout = async (req, res) => {
    try {
        const token = req.headers['x-access-token'];
        const decoded = jwt.verify(token, config.secret);
        const userFound = await User.findById(decoded.id);
        res.clearCookie('token');
        userFound.sesion = false;
        await userFound.save();
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.codeRecoverPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "Email not found." });
        }

        const code = Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7)
        user.code = code;
        await user.save();

        const token = jwt.sign({ email, code }, config.secret);
        await sendCodeRecoverEmail(user.email, code);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.validateCode = async (req, res) => {
    try {
        const token = req.headers['reset-pass-token'];
        const decode = jwt.verify(token, config.secret);
        const user = await User.findOne({ email: decode.email, code: decode.code });

        if (!user) {
            return res.status(404).json({ message: "User not found or code is incorrect." });
        }

        const { code } = req.body;

        if (code !== decode.code) {
            return res.status(400).json({ message: "Code is incorrect." });
        }

        const newToken = jwt.sign({ email: decode.email, code: code }, config.secret);
        res.status(200).json({ token: newToken });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.changePassword = async (req, res) => {
    try {
        const token = req.headers['reset-pass-token'];
        const decode = jwt.verify(token, config.secret);
        const user = await User.findOne({email: decode.email});

        if (!user) {
            return res.status(404).json({message: "User not found or code is incorrect."})
        }

        const {password} = req.body;

        if (!password) {
            return res.status(400).json({message: "Please provide a new password."})
        }

        user.password = await User.encryptPassword(password);
        user.code = null; 
        await user.save();

        await sendChangePasswordEmail(user.email, user.username)

        res.status(200).json({message: "Password changed successfully."});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
