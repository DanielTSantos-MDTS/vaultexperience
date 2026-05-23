import Reputacao from "../models/Reputacao.js";

export default {
    async listar (req, res) {
        try{
            const reputacaoLista = await Reputacao.find();
            return res.json(reputacaoLista);
        } catch (error){
            return res.status(500).json(`Erro ao listar reputações. Erro: ${error}`);
        }
    },
    async buscarPorId (req, res) {
        try {
            const id = req.params.id;
            const reputacao = await Reputacao.findById(id)

            if(!reputacao) return res.status(404).json('Reputação não encontrada')
            
            return res.status(200).json(reputacaoListaUm);
        } catch (error){
            return res.status(500).json(`Erro ao buscar reputação. Erro: ${error}`);
        }
    },
    async criar (req, res){
        try{
            const label = req.body.label;
            const novaReputacao = await Reputacao.create({ label: label });

            return res.status(201).json(novaReputacao);
        } catch (error){
            res.status(500).json(`Erro ao criar reputação. Erro: ${error}`);
        }
    },
    async atualizar (req, res){
        try{
            const id = req.params.id;
            const atualizcao = req.body.label;
            
            const reputacao = await Reputacao.findById(id);

            if (!reputacao) return res.status(404).json({Erro: 'Reputação não encontrada' });
            reputacao.label = atualizacao || reputacao.label;
            
            await reputacao.save();
            
            res.status(200).json(reputacao);
        } catch (error){
            res.status(500).json(`Erro ao atualizar Reputação. Erro ${error}`);
        }
    },
    async apagar (req, res){
        try{
            const id = req.params.id;
            
            const reputacao = await Reputacao.findByIdAndDelete(id)
            
            if (!reputacao) return res.status(404).json({Erro: 'Reputação não encontrada' });

            return res.json('Reputação excluída com sucesso!');
        } catch (error){
            return res.status(500).json(`Erro ao excluída reputação. Erro: ${error}`);
        }
    }
}