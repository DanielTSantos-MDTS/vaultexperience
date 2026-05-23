import Venda from "../models/Venda.js";

export default{
    async listar (req, res){
        try{
            const vendas = await Venda.find();

            res.status(200).json(vendas);
        } catch(error){
            res.status(404).json(`Erro ao listar vendas. Erro: ${error}`);
        };
    },
    async buscarPorId(req, res){
        try{
            const id = req.params.id;

            const venda = await Venda.findById(id);

            if(!venda) return res.status(404).json({Erro: "venda não encontrada"});
            
            res.status(200).json(venda);
        } catch (error){
            res.status(500).json(`Erro ao buscar venda. Erro: ${error}`);
        }
    },
    async criar(req, res){
        try{
            const corpo = req.body;

            const novaVenda = await Venda.create(corpo);

            return res.status(201).json(novaVenda);
        } catch(error){
            res.status(500).json(`Erro ao criar venda. Erro: ${error}`);
        };
    },
    async atualizar(req,res){
        try{
            const id = req.params.id;
            
            const atualizacao = req.body;
            
            const venda = await Venda.findById(id);

            if(!venda) return res.status(404).json({Erro: "Venda não encontrada"});

            Object.assign(venda, atualizacao);
            
            return res.status(200).json(venda);
        } catch(error){
            return res.status(500).json(`Erro ao atualizar venda. Erro: ${error}`);
        };
    },
    async apagar(req, res){
        try{
            const id = req.params.id;

            const venda = await Venda.findByIdAndDelete(id);

            if(!venda) return res.status(404).json7({Erro: "Venda não encontrada"});
            
            return res.status(200).json(`Venda apagada com sucesso`);
        } catch(error){
            return res.status(500).json(`Erro ao apagar venda. Erro: ${error}`);
        }
    }
}