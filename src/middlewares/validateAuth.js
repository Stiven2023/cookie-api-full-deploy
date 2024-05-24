import User from "../models/User.js";

exports.validateRegister = async (username, email, password) => {
    if (username.length < 8 || username.length > 20) {
        throw new Error("El nombre de usuario debe tener entre 8 y 20 caracteres");
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        throw new Error("El correo electrónico no es válido");
    }

    if (password.length < 8 || password.length > 16) {
        throw new Error("La contraseña debe tener entre 8 y 16 caracteres");
    }

    const userExists = await User.findOne({ username });
    if (userExists) {
        throw new Error("El nombre de usuario ya está en uso");
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
        throw new Error("El correo electrónico ya está en uso");
    }
};

exports.validateLogin = async (emailOrUsername, password) => {
    const userFound = await User.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] }).populate("role");

    if (!userFound) {
        throw new Error("Usuario no encontrado");
    }

    const matchPassword = await User.comparePassword(password, userFound.password);

    if (!matchPassword) {
        throw new Error("Contraseña inválida");
    }
};