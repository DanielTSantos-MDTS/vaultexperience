import User from "../models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default {
    async login(req, res){
        try{
            const emailDigitado = req.body.email;
            const senhaDigitada = req.body.senha;
            
            const usuario = await User.findOne({email: emailDigitado}).select("+senha");
            
            if(!usuario) return res.status(401).json({Erro: "Email ou senha incorreto"});
            
            const match = await bcrypt.compare(senhaDigitada, usuario.senha);
            if(match){
                const secret = "teste" //Substituir por variável de ambiente no futuro (.env)

                // "secret": "136629a1638bb491549b13632c2e33b4",
                // "expiration": 86400

                const jwtToken = jwt.sign({"id":usuario._id}, secret, {expiresIn: "2h"});

                return res.status(200).json(jwtToken);
                
            } else{
                return res.status(401).json({Erro: "Email ou senha incorreto"});
            }
        } catch (error){
            return res.status(500).json(`Erro ao fazer login. Erro: ${error}`)
        }
    }
}