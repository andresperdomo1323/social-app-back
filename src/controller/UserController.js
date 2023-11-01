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
        res.status(200).json({
            "success": true,
            "data": allUsers,
            "msg": "Usuarios encontrados",
        })
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
    console.log(req.body);
    try {
        req.body.password = bcrypt.hashSync(req.body.password, 10);
        const user = await userSchema.create(req.body);
        res.status(201).json({
            "success": true,
            "data": user,
            "msg": "Usuario creado",
        })

    } catch (error) {
        res.json({
            "success": false,
            "msg": "No se pudo crear el usuario",
            "error": error.message
        })
    }
}

exports.validEmail = async (req, res, next) => {
    const id = req.body._id
    const email = req.body.email;
    console.log(email);
    try {
        const emailExist = await userSchema.findOne({
            email: email
        })

        if(emailExist){
            res.status(200).json({
                "success": true,
                "msg": "El email ya existe",
            })
        } else {
            res.status(200).json({
                "success": true,
                "msg": "El email no existe",
            })
        }

    } catch (error) {
        console.log(error.message);
    }
}

exports.validUsername = async (req, res, next) => {

    
    const username = req.body.username;
    console.log(username);
    try {
        const usernameExist = await userSchema.findOne({
            username: username
        })

        if(usernameExist){
            res.status(200).json({
                "success": true,
                "msg": "El username ya existe",
            })
        } else {
            res.status(200).json({
                "success": true,
                "msg": "El username no existe",
            })
        }

    } catch (error) {
        console.log(error.message);
    }
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

    console.log(user, createToken(user))
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