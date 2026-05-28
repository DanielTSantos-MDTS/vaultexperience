import express from 'express';
import jwt from 'jsonwebtoken';
import authController from '../controllers/authController.js';

export default {
    async autorizar (req, res, next){
        const authorization = req.headers.authorization;

        if(!authorization) return res.status(401).json({Erro: "Sem token"});

        const parts = authorization.split(' ');

        if (parts.length != 2) return res.status(401).json({Erro: "Formato de Token Invalido"});

        jwt.verify(parts[1], process.env.JWT_SECRET, (error, decoded) => {
            
            if(error) return res.status(401).json({Erro: "Token Invalido"});

            req.id = decoded.id;

            return next();
        })
    }
}