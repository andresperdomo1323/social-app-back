const msgError = require('http-errors')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const userSchema = require('../models/user')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const { OAuth2Client } = require('google-auth-library');


// Todos los usuarios
exports.getUsers = async (req, res, next) => {
    try{
        const allUsers = await userSchema.find();
        res.status(200).json(allUsers)
    } catch(error){
        console.log(error.message);
    }
}

// Un usuario
exports.getUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        console.log(userId);
        const user = await userSchema.findById(userId);
        if(!user){
            res.status(200).json({
                "success": true,
                "msg": "No se encontro el usuario"
            })
        } else {
            res.status(200).json({
                "success": true,
                "data": user,
                "msg": "Usuario encontrado"
            })
        }

    } catch (error) {
        console.log(error.message);
        if( error instanceof mongoose.CastError){
            next(msgError(400, "Id invalido"));
            return;
        }
        next(error);
    }
}

// Crear usuario
exports.createUser = async (req, res, next) => {
    try {
        const validationErrors = validateUser(req.body);

        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                msg: validationErrors,
            });
        }

        req.body.password = bcrypt.hashSync(req.body.password, 10);
        const user = await userSchema.create(req.body);
        console.log("Usuario creado correctamente:", user);
        res.status(201).json({
            success: true,
            data: user,
            msg: "Usuario creado",
        });
    } catch (error) {
        handleCreateUserError(error, res);
    }
};

function validateUser(userData) {
    const requiredFields = ["username", "email", "password"];
    const missingFields = requiredFields.filter(field => !userData[field]);
    const errorMessages = [];

    if (missingFields.length > 0) {
        errorMessages.push(`Los campos requeridos ${missingFields.join(", ")} no pueden estar vacíos.`);
    }

    if (userData.password.length < 10) {
        errorMessages.push("La contraseña debe tener al menos 10 caracteres.");
    }

    return errorMessages;
}

function handleCreateUserError(error, res) {
    const errorMessages = [];

    if (error.code === 11000) {
        errorMessages.push("El correo electrónico ya está registrado");
    } else if (error.errors && error.errors.password) {
        errorMessages.push("La contraseña debe tener al menos 10 caracteres");
    } else {
        errorMessages.push("No se pudo crear el usuario");
    }

    console.log("Error desconocido:", error);
    res.status(500).json({
        success: false,
        msg: errorMessages,
        error: error.message,
    });
}


// Crear token
function createToken(user){
    const payload = {
        userId: user._id,
        userRol: user.role,
        userName: user.username,
    }
    return jwt.sign(payload, 'secretKey' , {expiresIn: '1h'})
}


// Login usuario
exports.loginUser = async (req, res, next) => {
    // comprobar si el usuario existe
    const user = await userSchema.findOne({
        email: req.body.email
    })
    if(!user){
        res.status(404).json({
            "success": false,
            "msg": "Usuario no encontrado",
        })
    }
    // comprobar si la contraseña es correcta
    const validPassword = bcrypt.compare(req.body.password, user.password);
    if(!validPassword){
        res.status(400).json({
            "success": false,
            "msg": "Contraseña incorrecta",
        })
    } res.status(200).json({
        "success": true,
        "data": user,
        "msg": "Usuario logueado",
        "token": createToken(user)

    })
    console.log(user)
}

// Actualizar usuario
exports.updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const update = req.body;
        const options = {new: true};

        const updateResult = await userSchema.findByIdAndUpdate({ _id:id}, update, options);
        if(!updateResult){
            res.status(200).json({
                "success": true,
                "msg": "No se encontro el usuario",
            })
        } else {
            res.status(200).json({
                "success": true,
                "data": updateResult,
                "msg": "Usuario actualizado",
            })
        }

    } catch (error) {
        console.log(error.message);
        if( error instanceof mongoose.CastError){
            next(msgError(400, "Id invalido"));
            return;
        }
        next(error);
    }
}

// Eliminar usuario
exports.deleteUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const deleteResult = await userSchema.findByIdAndDelete({_id: id});
        if(!deleteResult){
            res.status(200).json({
                "success": true,
                "msg": "No se encontro el usuario",
            })
        } else {
            res.status(200).json({
                "success": true,
                "data": deleteResult,
                "msg": "Usuario eliminado",
            })
        }
    } catch (error) {
        console.log(error.message);
        if( error instanceof mongoose.CastError){
            next(msgError(400, "Id invalido"));
            return;
        }
        next(error);
    }
}


exports.registervalidation = async (req, res, next) => {
    try {
      const emailToCheck = req.body.email; // Supongamos que el correo a verificar llega en el cuerpo de la solicitud.
  
      const user = await userSchema.findOne({ email: emailToCheck });
  
        if (user) {
            // El correo electrónico ya está registrado
            res.status(200).json({ message: 'El correo electrónico ya está registrado' });
        } else {
            // El correo electrónico no está registrado
            res.status(200).json({ message: 'El correo electrónico no está registrado' });
        }
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  }
 
  
  
  