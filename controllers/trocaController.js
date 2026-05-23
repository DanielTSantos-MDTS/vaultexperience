import { json } from 'express';
import Troca from '../models/Troca.js';

export default{
    async listar(req, res){
        try{
            const trocas = await Troca.find();

            res.status(200).json(trocas);
        } catch(error){
            res.status(500).json(`Erro ao listar trocas. Erro: ${error}`);
        }
    },
    async buscarPorId(req,res){
        try{
            const id = req.params.id;

            const troca = await Troca.findById(id);

            if(!troca) return res.status(404).json({Erro: "Troca não encontrada"});

            return res.status(200).json(troca);
        } catch(error){
            res.status(500).json(`Erro ao buscar troca. Erro: ${error}`);
        }
    },
    async criar(req, res){
        try{
            const corpo = req.body;

            const novaTroca = await Troca.create(corpo);

            return res.status(201).json(novaTroca);
        } catch (error){
            return res.status(500).json(`Erro ao criar troca. Erro: ${error}`);
        }
    },
    async atualizar(req, res){
        try{
            const id = req.params.id;

            const atualizacao = req.body;

            const troca = await Troca.findById(id);

            if(!troca) return res.status(404).json({Erro: "Troca não encontrada"});

            Object.assign(troca, corpo);
            
            return res.status(200).json(troca);
        } catch(error){
            return res.status(500).json(`Erro ao atualizar troca. Erro: ${error}`);
        }
    },
    async apagar(req, res){
        try{
            const id = req.params.id;

            const troca = await Troca.findByIdAndDelete(id);

            if(!troca) return res.status(404).json({Erro: "Troca não encontrada"});

            return res.status(200).json(`Troca apagada com sucesso`);
        } catch(error){
            return res.status(500).json(`Erro ao apagar troca. Erro: ${error}`);
        }
    }
}