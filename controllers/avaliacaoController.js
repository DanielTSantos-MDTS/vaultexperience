import Avaliacao from "../models/Avaliacao.js";

export default {
    async listar (req, res){
        try{
            const avaliacoes = await Avaliacao.find();

            return res.status(200).json(avaliacoes);
        } catch (error) {
            return res.status(500).json(`Erro ao listar avaliações. Erro: ${error}`);
        }
    },
    async buscarPorId (req, res){
        try{
            const id = req.params.id;
            
            const avaliacao = await Avaliacao.findById(id);
            
            if(!avaliacao) return res.status(404).json('Avaliação não encontrada')
                
            return res.status(200).json(avaliacao);
            } catch (error){
                return res.status(500).json(`Erro ao buscar avaliação. Erro: ${error}`);
            }
        },
    async criar (req, res){
        try{
            const corpo = req.body;
        
            const novaAvaliacao = await Avaliacao.create(corpo);

            return res.status(201).json(novaAvaliacao);
        } catch (error){
            return res.status(500).json(`Erro ao criar avaliação. Erro: ${error}`);
        }
    },
    async atualizar (req, res){
        try{
            const id = req.params.id;
            
            const atualizacao = req.body;
            
            const avaliacao = await Avaliacao.findById(id);
            
            if(!avaliacao) return res.status(404).json('Avaliação não encontrada');
            
            Object.assign(avaliacao, atualizacao);
            
            await avaliacao.save();
            
            return res.status(200).json(avaliacao);
        } catch (error){
            return res.status(500).json(`Erro ao atualizar avaliação. Erro: ${error}`);
        }
    },
    async apagar (req, res){
        try{
            const id = req.params.id;

            const avaliacao = await Avaliacao.findByIdAndDelete(id);

            if(!avaliacao) return res.status(500).json({Erro: 'Avaliação não encontrada'});

            return res.json('Avaliação excluída com sucesso');
        } catch (error){
            return res.status(500).json(`Erro ao excluída avaliação. Erro: ${error}`);
        }
    }
}