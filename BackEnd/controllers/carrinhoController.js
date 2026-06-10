import Carrinho from "../models/Carrinho.js";
import Item from "../models/Iten.js";

function resolveItemId(ref) {
    if (!ref) return null;
    if (typeof ref === 'string') return ref;
    if (ref._id) return ref._id.toString();
    return ref.toString();
}

export default {
    async obterCarrinho(req, res) {
        try {
            const usuarioId = req.id;

            let carrinho = await Carrinho.findOne({ usuario: usuarioId })
                .populate('itens.item');

            if (!carrinho) {
                carrinho = await Carrinho.create({ usuario: usuarioId, itens: [] });
            }

            res.status(200).json(carrinho);
        } catch (error) {
            res.status(500).json({ erro: `Erro ao obter carrinho: ${error.message}` });
        }
    },

    async adicionarAoCarrinho(req, res) {
        try {
            const usuarioId = req.id;
            const { itemId, quantidade = 1 } = req.body;

            if (!itemId) {
                return res.status(400).json({ erro: 'itemId é obrigatório' });
            }

            if (quantidade <= 0) {
                return res.status(400).json({ erro: 'Quantidade deve ser maior que 0' });
            }

            // Verificar se item existe
            const item = await Item.findById(itemId);
            if (!item) return res.status(404).json({ erro: 'Item não encontrado' });

            if (item.estoqueQtd < quantidade) {
                return res.status(400).json({ erro: 'Quantidade indisponível em estoque' });
            }

            // Encontrar ou criar carrinho
            let carrinho = await Carrinho.findOne({ usuario: usuarioId });
            if (!carrinho) {
                carrinho = await Carrinho.create({ usuario: usuarioId, itens: [] });
            }

            // Verificar se item já está no carrinho
            const itemExistente = carrinho.itens.find(i => resolveItemId(i.item) === itemId);

            if (itemExistente) {
                itemExistente.quantidade += quantidade;
            } else {
                carrinho.itens.push({
                    item: itemId,
                    quantidade: quantidade,
                    precoUnitario: item.precoOriginal
                });
            }

            carrinho.dataAtualizado = new Date();
            await carrinho.save();
            await carrinho.populate('itens.item');

            res.status(200).json(carrinho);
        } catch (error) {
            res.status(500).json({ erro: `Erro ao adicionar ao carrinho: ${error.message}` });
        }
    },

    async removerDoCarrinho(req, res) {
        try {
            const usuarioId = req.id;
            const { itemId } = req.params;

            const carrinho = await Carrinho.findOne({ usuario: usuarioId });
            if (!carrinho) {
                return res.status(404).json({ erro: 'Carrinho não encontrado' });
            }

            carrinho.itens = carrinho.itens.filter(i => resolveItemId(i.item) !== itemId);
            carrinho.dataAtualizado = new Date();
            await carrinho.save();
            await carrinho.populate('itens.item');

            res.status(200).json(carrinho);
        } catch (error) {
            res.status(500).json({ erro: `Erro ao remover do carrinho: ${error.message}` });
        }
    },

    async atualizarQuantidade(req, res) {
        try {
            const usuarioId = req.id;
            const { itemId } = req.params;
            const { quantidade } = req.body;
            const qty = parseInt(quantidade, 10);

            if (!qty || qty <= 0) {
                return res.status(400).json({ erro: 'Quantidade deve ser maior que 0' });
            }

            // Verificar estoque
            const item = await Item.findById(itemId);
            if (!item) return res.status(404).json({ erro: 'Item não encontrado' });

            if (item.estoqueQtd < qty) {
                return res.status(400).json({ erro: 'Quantidade indisponível em estoque' });
            }

            const carrinho = await Carrinho.findOne({ usuario: usuarioId });
            if (!carrinho) {
                return res.status(404).json({ erro: 'Carrinho não encontrado' });
            }

            const itemCarrinho = carrinho.itens.find(i => resolveItemId(i.item) === itemId);
            if (!itemCarrinho) {
                return res.status(404).json({ erro: 'Item não está no carrinho' });
            }

            itemCarrinho.quantidade = qty;
            carrinho.dataAtualizado = new Date();
            await carrinho.save();
            await carrinho.populate('itens.item');

            res.status(200).json(carrinho);
        } catch (error) {
            res.status(500).json({ erro: `Erro ao atualizar quantidade: ${error.message}` });
        }
    },

    async limparCarrinho(req, res) {
        try {
            const usuarioId = req.id;

            const carrinho = await Carrinho.findOne({ usuario: usuarioId });
            if (!carrinho) {
                return res.status(404).json({ erro: 'Carrinho não encontrado' });
            }

            carrinho.itens = [];
            carrinho.dataAtualizado = new Date();
            await carrinho.save();

            res.status(200).json({ mensagem: 'Carrinho limpo com sucesso' });
        } catch (error) {
            res.status(500).json({ erro: `Erro ao limpar carrinho: ${error.message}` });
        }
    }
};
