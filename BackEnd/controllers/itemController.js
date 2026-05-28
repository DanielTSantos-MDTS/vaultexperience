import Item from "../models/Iten.js";
import User from "../models/User.js";

export default {
    async listar (req, res){
        try{
        const itens = await Item.find()
        .populate('dono', 'username')
        .populate('categoria', 'nome');

        res.status(200).json(itens);
        } catch (error) {
            res.status(500).json(`Erro ao listar itens. Erro: ${error}`);
        }
    },
    async buscarPorId (req, res){
        try{
            const id = req.params.id;

            const item = await Item.findById(id)
            .populate('dono', 'username')
            .populate('categoria', 'nome');

            if (!item) return res.status(404).json({Erro: 'Item não encontrado'});

            return res.status(200).json(item);
        } catch (error) {
            res.status(500).json(`Erro ao buscar item. Erro: ${error}`);
        }
    },
    async criar (req, res) {
        try{
            const corpo = req.body;

            corpo.dono = req.id;
            
            if(req.files && req.files.length > 0){
                corpo.imagens = req.files.map(arquivo => arquivo.path);
            }

            if(corpo.especificacoes){
                try{
                    corpo.especificacoes = JSON.parse(corpo.especificacoes);
                } catch (e){
                    console.error("Erro ao desempacotar as especificações: " + e);
                    return res.status(400).json({Erro: `Formato de Especificações Inválidas.`});
                }
            }
            
            const novoItem = await Item.create(corpo);

            await novoItem.populate('dono', 'username');
            
            await novoItem.populate('categoria', 'nome');

            return res.status(201).json(novoItem);
        } catch (error) {
            return res.status(500).json({Erro: `Erro ao criar item. Erro: ${error}`});
        }
    },
    async atualizar (req, res){
        try{
            const id = req.params.id;

            const atualizacao = req.body;
            
            const item = await Item.findById(id);
            
            if(!item) return res.status(404).json({Erro: 'Item não encontrado'});

            if(!(item.dono.equals(req.id))) return res.status(403).json({Erro: "Somente o dono do item pode alterá-lo"});
            
            Object.assign(item, atualizacao);

            await item.save();

            await item
            .populate('dono', 'username')
            .populate('categoria', 'nome');

            return res.status(200).json(item);
        } catch (error){
            return res.status(500).json(`Erro ao atualizar item. Erro: ${error}`);
        }
    },
    async apagar (req, res){
        try{
            const id = req.params.id;

            const item = await Item.findById(id);

            if(!item) return res.status(404).json({Erro: 'Item não encontrado'});

            if(!(item.dono.equals(req.id))) return res.status(403).json({Erro: "Somente o dono do item pode alterá-lo"});

            await item.deleteOne();

            
            res.status(200).json('Item excluído com sucesso');
        } catch (error){
            res.status(500).json(`Erro ao excluir item. Erro: ${error}`);
        }
    }
}