import Favorito from "../models/Favorito.js";
import Item from "../models/Iten.js";
import User from "../models/User.js";

export default {
    async listarFavoritos(req, res) {
        try {
            const usuarioId = req.id;

            const favoritos = await Favorito.find({ usuario: usuarioId })
                .populate('item')
                .populate('usuario', 'username');

            res.status(200).json(favoritos);
        } catch (error) {
            res.status(500).json({ erro: `Erro ao listar favoritos: ${error.message}` });
        }
    },

    async adicionarFavorito(req, res) {
        try {
            const usuarioId = req.id;
            const { itemId } = req.body;

            // Verificar se item existe
            const item = await Item.findById(itemId);
            if (!item) return res.status(404).json({ erro: 'Item não encontrado' });

            // Verificar se já está nos favoritos
            const jaExiste = await Favorito.findOne({
                usuario: usuarioId,
                item: itemId
            });

            if (jaExiste) {
                return res.status(400).json({ erro: 'Item já está nos favoritos' });
            }

            const novoFavorito = await Favorito.create({
                usuario: usuarioId,
                item: itemId
            });

            await novoFavorito.populate('item');
            await novoFavorito.populate('usuario', 'username');

            res.status(201).json(novoFavorito);
        } catch (error) {
            res.status(500).json({ erro: `Erro ao adicionar favorito: ${error.message}` });
        }
    },

    async removerFavorito(req, res) {
        try {
            const usuarioId = req.id;
            const { itemId } = req.params;

            const favorito = await Favorito.findOneAndDelete({
                usuario: usuarioId,
                item: itemId
            });

            if (!favorito) {
                return res.status(404).json({ erro: 'Favorito não encontrado' });
            }

            res.status(200).json({ mensagem: 'Favorito removido com sucesso' });
        } catch (error) {
            res.status(500).json({ erro: `Erro ao remover favorito: ${error.message}` });
        }
    },

    async verificarFavorito(req, res) {
        try {
            const usuarioId = req.id;
            const { itemId } = req.params;

            const favorito = await Favorito.findOne({
                usuario: usuarioId,
                item: itemId
            });

            res.status(200).json({ isFavorito: !!favorito });
        } catch (error) {
            res.status(500).json({ erro: `Erro ao verificar favorito: ${error.message}` });
        }
    }
};
