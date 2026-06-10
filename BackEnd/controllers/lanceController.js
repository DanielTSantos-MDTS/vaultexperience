import Lance from "../models/Lance.js";
import Item from "../models/Iten.js";
import User from "../models/User.js";

export default {
    async fazerLance(req, res) {
        try {
            const usuarioId = req.id;
            const { itemId, valor } = req.body;

            // Validar entrada
            if (!itemId || !valor) {
                return res.status(400).json({ erro: 'itemId e valor são obrigatórios' });
            }

            if (valor <= 0) {
                return res.status(400).json({ erro: 'Valor deve ser maior que 0' });
            }

            // Verificar se item existe
            const item = await Item.findById(itemId);
            if (!item) return res.status(404).json({ erro: 'Item não encontrado' });

            // Verificar se é o dono do item
            if (item.dono.toString() === usuarioId) {
                return res.status(400).json({ erro: 'Você não pode fazer lance no seu próprio item' });
            }

            // Buscar maior lance anterior
            const maiorLance = await Lance.findOne({ item: itemId })
                .sort({ valor: -1 });

            // Se houver um lance anterior, o novo lance deve ser maior
            if (maiorLance && valor <= parseFloat(maiorLance.valor)) {
                return res.status(400).json({
                    erro: `O valor do lance deve ser maior que ${maiorLance.valor}`,
                    maiorLanceAtual: parseFloat(maiorLance.valor)
                });
            }

            const novoLance = await Lance.create({
                item: itemId,
                usuario: usuarioId,
                valor: valor
            });

            await novoLance.populate('usuario', 'username');
            await novoLance.populate('item', 'titulo');

            res.status(201).json(novoLance);
        } catch (error) {
            res.status(500).json({ erro: `Erro ao fazer lance: ${error.message}` });
        }
    },

    async listarLances(req, res) {
        try {
            const { itemId } = req.params;

            // Verificar se item existe
            const item = await Item.findById(itemId);
            if (!item) return res.status(404).json({ erro: 'Item não encontrado' });

            const lances = await Lance.find({ item: itemId })
                .sort({ valor: -1, dataLance: -1 })
                .populate('usuario', 'username');

            res.status(200).json(lances);
        } catch (error) {
            res.status(500).json({ erro: `Erro ao listar lances: ${error.message}` });
        }
    },

    async obterMaiorLance(req, res) {
        try {
            const { itemId } = req.params;

            const maiorLance = await Lance.findOne({ item: itemId })
                .sort({ valor: -1 })
                .populate('usuario', 'username');

            if (!maiorLance) {
                const item = await Item.findById(itemId);
                return res.status(200).json({
                    lance: null,
                    priceFloor: parseFloat(item.precoOriginal)
                });
            }

            res.status(200).json({
                lance: maiorLance,
                priceFloor: parseFloat(maiorLance.valor)
            });
        } catch (error) {
            res.status(500).json({ erro: `Erro ao obter maior lance: ${error.message}` });
        }
    },

    async listarMeusLances(req, res) {
        try {
            const usuarioId = req.id;

            const lances = await Lance.find({ usuario: usuarioId })
                .sort({ dataLance: -1 })
                .populate('item', 'titulo');

            res.status(200).json(lances);
        } catch (error) {
            res.status(500).json({ erro: `Erro ao listar meus lances: ${error.message}` });
        }
    }
};
