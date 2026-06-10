import Venda from "../models/Venda.js";
import Item from "../models/Iten.js";

export default{
    async listar (req, res){
        try{
            const vendas = await Venda.find()
            .populate('comprador', 'username')
            .populate('vendedor', 'username')
            .populate('item', 'titulo');

            res.status(200).json(vendas);
        } catch(error){
            res.status(500).json(`Erro ao listar vendas. Erro: ${error}`);
        };
    },
    async buscarPorId(req, res){
        try{
            const id = req.params.id;

            const venda = await Venda.findById(id)
            .populate('comprador', 'username')
            .populate('vendedor', 'username')
            .populate('item', 'titulo');

            if(!venda) return res.status(404).json({Erro: "Venda não encontrada"});
            
            res.status(200).json(venda);
        } catch (error){
            res.status(500).json(`Erro ao buscar venda. Erro: ${error}`);
        }
    },
    async criar(req, res){
        try{
            const corpo = req.body;

            const novaVenda = await Venda.create(corpo);

            await novaVenda.populate('comprador', 'username');
            await novaVenda.populate('vendedor', 'username');
            await novaVenda.populate('item', 'titulo');
            
            return res.status(201).json(novaVenda);
        } catch(error){
            res.status(500).json(`Erro ao criar venda. Erro: ${error}`);
        };
    },
    async listarCompras(req, res) {
        try {
            const vendas = await Venda.find({ comprador: req.id })
                .sort({ dataOferta: -1 })
                .populate('comprador', 'username')
                .populate('vendedor', 'username')
                .populate('item', 'titulo');

            return res.status(200).json(vendas);
        } catch (error) {
            return res.status(500).json({ erro: `Erro ao listar compras: ${error.message}` });
        }
    },
    async listarVendasUsuario(req, res) {
        try {
            const vendas = await Venda.find({ vendedor: req.id })
                .sort({ dataOferta: -1 })
                .populate('comprador', 'username')
                .populate('vendedor', 'username')
                .populate('item', 'titulo');

            return res.status(200).json(vendas);
        } catch (error) {
            return res.status(500).json({ erro: `Erro ao listar vendas: ${error.message}` });
        }
    },
    async criarCompra(req, res) {
        try {
            const { itemId, valorOfertado, status = 'Pendente', quantidade = 1 } = req.body;
            const qty = Math.max(1, parseInt(quantidade, 10) || 1);

            if (!itemId || valorOfertado == null) {
                return res.status(400).json({ erro: 'itemId e valorOfertado são obrigatórios' });
            }

            const item = await Item.findById(itemId);
            if (!item) return res.status(404).json({ erro: 'Item não encontrado' });

            if (item.dono.toString() === req.id) {
                return res.status(400).json({ erro: 'Você não pode comprar seu próprio item' });
            }

            if (item.estoqueQtd < qty) {
                return res.status(400).json({ erro: 'Quantidade indisponível em estoque' });
            }

            const novaVenda = await Venda.create({
                comprador: req.id,
                vendedor: item.dono,
                item: itemId,
                status,
                valorOfertado,
            });

            item.estoqueQtd = Math.max(0, item.estoqueQtd - qty);
            await item.save();

            await novaVenda.populate('comprador', 'username');
            await novaVenda.populate('vendedor', 'username');
            await novaVenda.populate('item', 'titulo');

            return res.status(201).json(novaVenda);
        } catch (error) {
            return res.status(500).json({ erro: `Erro ao registrar compra: ${error.message}` });
        }
    },
    async atualizar(req,res){
        try{
            const id = req.params.id;
            
            const atualizacao = req.body;
            
            const venda = await Venda.findById(id);

            if(!venda) return res.status(404).json({Erro: "Venda não encontrada"});

            Object.assign(venda, atualizacao);
            
            await venda.save();

            await venda.populate('comprador', 'username');
            await venda.populate('vendedor', 'username');
            await venda.populate('item', 'titulo');
            
            return res.status(200).json(venda);
        } catch(error){
            return res.status(500).json(`Erro ao atualizar venda. Erro: ${error}`);
        };
    },
    async apagar(req, res){
        try{
            const id = req.params.id;

            const venda = await Venda.findByIdAndDelete(id);

            if(!venda) return res.status(404).json({Erro: "Venda não encontrada"}); // corrigido: era json7()

            return res.status(200).json(`Venda apagada com sucesso`);
        } catch(error){
            return res.status(500).json(`Erro ao apagar venda. Erro: ${error}`);
        }
    }
}
