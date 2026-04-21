import Reputacao from "../models/Reputacao.js";

export default {
    async listar (req, res) {
        try{
            const reputacaoLista = await Reputacao.find();
            return res.json(reputacaoLista);
        } catch (error){
            return res.status(500).json(`Erro ao listar reputação. Erro: ${error}`);
        }
    },
    async listarUm (req, res) {
        try {
            const id = req.params.id;
            const reputacaoListaUm = await Reputacao.findById(id)
            return res.json(reputacaoListaUm);
        } catch (error){
            return res.status(500).json(`Erro ao listar reputação específica. Erro: ${error}`);
        }
    },
    async adicionar (req, res){
        try{
            const label = req.body.label;
            const novaReputacao = await Reputacao.create({ label: label });

            return res.status(201).json(novaReputacao);
        } catch (error){
            res.status(500).json(`Erro ao criar nova reputação. Erro: ${error}`);
        }
    },
    async atualizar (req, res){
        try{
            const id = req.params.id;
            const label = req.body.label;
            
            const reputacao = await Reputacao.findById(id);

            if (!reputacao) return res.status(404).json({Erro: 'Reputação não encontrada' });
            reputacao.label = label || reputacao.label;
            
            await reputacao.save();
            
            res.json('Reputação atualizada com sucesso')
        } catch (error){
            res.status(500).json(`Erro ao atualizar Reputação`);
        }
    },
    async deletar (req, res){
        try{
            const id = req.params.id;
            
            const reputacao = await Reputacao.findByIdAndDelete(id)
            
            if (!reputacao) return res.status(404).json({Erro: 'Reputação não encontrada' });

            return res.json('Reputação apagada com sucesso!');
        } catch (error){
            return res.status(500).json(`Erro ao apagar reputação. Erro: ${error}`);
        }
    }
}