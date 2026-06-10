import User from "../models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default {
    async login(req, res){
        try{
            const usuarioDigitado = req.body.username;
            const senhaDigitada = req.body.password;
            
            const usuario = await User.findOne({
                $or: [
                    {contatoPrincipal: usuarioDigitado},
                    {username: usuarioDigitado}
                ]}).select("+password");
            
            if(!usuario) return res.status(401).json({Erro: "Email ou senha incorreto"});
            
            const match = await bcrypt.compare(senhaDigitada, usuario.password);
            if(match){
                const secret = process.env.JWT_SECRET

                const jwtToken = jwt.sign({"id":usuario._id}, secret, {expiresIn: "2h"});

                return res.status(200).json({
                    token: jwtToken,
                    username: usuario.username,
                    id: usuario._id,
                });
                
            } else{
                return res.status(401).json({Erro: "Email ou senha incorreto"});
            }
        } catch (error){
            return res.status(500).json(`Erro ao fazer login. Erro: ${error}`)
        }
    }
}