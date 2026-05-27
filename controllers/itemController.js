import Item from "../models/Iten.js";
import User from "../models/User.js";

export default {
    async listar (req, res){
        try{
        const itens = await Item.find()
        .populate('dono', 'usuario')
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
            .populate('dono', 'usuario')
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

            const vendedor = await User.findById(req.id);

            if(!vendedor) return res.status(404).json({Erro: "Vendedor não encontrado"});

            corpo.localizacao = vendedor.endereco;
            
            corpo.dono = req.id;
            
            const novoItem = await Item.create(corpo);

            await novoItem.populate('dono', 'usuario');
            
            await novoItem.populate('categoria', 'nome');

            return res.status(201).json(novoItem);
        } catch (error) {
            return res.status(500).json(`Erro ao criar item. Erro: ${error}`);
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
            .populate('dono', 'usuario')
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