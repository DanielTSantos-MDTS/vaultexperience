import Categoria from '../models/Categoria.js';

export default {
    async listar (req, res){
        try{
            const categorias = await Categoria.find();

            res.status(200).json(categorias);
        } catch (error){
            res.status(500).json(`Erro ao listar categorias. Erro: ${error}`);
        }
    },
    async buscarPorId (req, res){
        try{
            const id = req.params;

            const categoria = await Categoria.findById(id);

            if(!categoria) return res.status(404).json({Erro: "Não foi possível encontrar essa categoria"});

            return res.status(200).json(categoria);
        } catch(error){
            return res.status(500).json(`Erro ao buscar item. Erro ${error}`);
        }
    },
    async criar (req, res){
        try{
            const corpo = req.body;

            const novaCategoria = await Categoria.create(corpo);

            return res.status(201).json(novaCategoria);
        } catch (error) {
            return res.status(500).json(`Erro ao criar categoria. Erro: ${error}`);
        }
    },
    async atualizar (req, res){
        try{
            const id = req.params;

            const atualizacao = req.body;

            const categoria = await Categoria.findById(id);

            if(!categoria) return res.status(404).json({Erro: `Categoria não encontrada`});
            
            Object.assign(categoria, atualizacao);

            await categoria.save();

            return res.status(200).json(categoria);
        } catch(error) {
            return res.status(500).json(`Não foi possível atualizar categoria. Erro: ${error}`);
        }
    },
    async apagar (req, res){
        try{
            const id = req.params;

            const categoria = await Categoria.findByIdAndDelete(id);

            if(!categoria) return res.status(404).json({Erro: `Categoria não encontrada`});

            return res.status(200).json('Categoria excluída com sucesso');
        } catch (error){
            return res.status(500).json(`Erro ao apagar categoria. Erro: ${error}`);
        }
    }
}