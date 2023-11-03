const msgError = require('http-errors')
const mongoose = require('mongoose')
const publicationSchema = require('../models/publication')

// Todas las publicaciones
exports.getPublications = async (req, res, next) => {
    try{
        const allPublications = await publicationSchema.find();
        res.status(200).json({
            "success": true,
            "data": allPublications,
            "msg": "Publicaciones encontradas",
        })
    } catch(error){
        console.log(error.message);
    }
}

// Una publicacion
exports.getPublication = async (req, res, next) => {
    try{
        const id = req.params.id;
        const publication = await publicationSchema.findById({_id: id});
        if(!publication){
            res.status(200).json({
                "success": true,
                "msg": "No se encontro la publicacion"
            })
        } else {
            res.status(200).json({
                "success": true,
                "data": publication,
                "msg": "Publicacion encontrada"
            })
        }
    } catch(error){
        console.log(error.message);
        if( error instanceof mongoose.CastError){
            next(msgError(400, "Id invalido"));
            return;
        }
        next(error);
    }
}

// Crear publicacion
exports.createPublication = async (req, res, next) => {
    console.log(req.body);
    try{
        const publication = await publicationSchema.create(req.body);
        res.status(201).json({
            "success": true,
            "data": publication,
            "msg": "Publicacion creada",
        })
    } catch(error){
       res.json({
            "success": false,
            "msg": "No se pudo crear la publicacion",
            "error": error.message
       })
    }
}

// Actualizar publicacion
exports.updatePublication = async (req, res, next) => {
    try{
        const id = req.params.id;
        const update = req.body;
        const options = {new: true};

        const updateResult = await publicationSchema.findByIdAndUpdate({ _id:id}, update, options);
        if(!updateResult){
            res.status(200).json({
                "success": true,
                "msg": "No se encontro la publicacion",
            })
        } else {
            res.status(200).json({
                "success": true,
                "data": updateResult,
                "msg": "Publicacion actualizada",
            })
        }
    } catch(error){
        console.log(error.message);
        if( error instanceof mongoose.CastError){
            next(msgError(400, "Id invalido"));
            return;
        }
        next(error);
    }
}

// Eliminar publicacion

exports.deletePublication = async (req, res, next) => {
    try{
        const id = req.params.id;
        const deleteResult = await publicationSchema.findByIdAndDelete({_id: id});
        if(!deleteResult){
            res.status(200).json({
                "success": true,
                "msg": "No se encontro la publicacion",
            })
        }else{
            res.status(200).json({
                "success": true,
                "data": deleteResult,
                "msg": "Publicacion eliminada",
            })
        }
    }catch(error){
        console.log(error.message);
        if( error instanceof mongoose.CastError){
            next(msgError(400, "Id invalido"));
            return;
        }
        next(error);
    }

}

