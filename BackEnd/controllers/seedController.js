import mongoose from 'mongoose';
import Item from '../models/Iten.js';
import User from '../models/User.js';
import Categoria from '../models/Categoria.js';
import Carrinho from '../models/Carrinho.js';
import Favorito from '../models/Favorito.js';
import Lance from '../models/Lance.js';
import Venda from '../models/Venda.js';
import { CATEGORIAS_SEED, ITENS_SEED } from '../data/catalogoSeed.js';

const SEED_KEY = process.env.SEED_KEY || 'vault-seed-dev';

function autorizarSeed(req, res) {
    const key = req.headers['x-seed-key'];
    if (key !== SEED_KEY) {
        res.status(403).json({
            erro: 'Chave de seed inválida. Envie o header x-seed-key.',
        });
        return false;
    }
    return true;
}

function ensureDb(res) {
    if (mongoose.connection.readyState !== 1) {
        res.status(503).json({
            erro: 'Banco de dados não conectado. Verifique o MongoDB e reinicie o servidor (node index.js).',
        });
        return false;
    }
    return true;
}

function filtroItensTeste(extra = {}) {
    return {
        ...extra,
        $or: [
            { badges: 'SEED_VAULT' },
            { imagens: { $elemMatch: { $regex: 'placehold', $options: 'i' } } },
            { imagens: { $elemMatch: { $regex: 'picsum\\.photos', $options: 'i' } } },
            { titulo: { $regex: /^(teste|test |item teste|produto teste|mock)/i } },
            { descricao: { $regex: /^teste\b/i } },
        ],
    };
}

async function resolverDono(req) {
    if (req.id) return req.id;

    const bodyId = req.body?.donoId;
    if (bodyId) {
        const user = await User.findById(bodyId);
        if (user) return user._id;
    }

    const primeiro = await User.findOne().sort({ dataCriação: 1 });
    return primeiro?._id || null;
}

async function garantirCategorias() {
    const mapa = {};
    for (const nome of CATEGORIAS_SEED) {
        let cat = await Categoria.findOne({ nome });
        if (!cat) {
            cat = await Categoria.create({ nome });
        }
        mapa[nome] = cat._id;
    }
    return mapa;
}

async function limparReferenciasItens(ids) {
    if (!ids.length) return;

    await Promise.all([
        Carrinho.updateMany(
            { 'itens.item': { $in: ids } },
            { $pull: { itens: { item: { $in: ids } } } }
        ),
        Favorito.deleteMany({ item: { $in: ids } }),
        Lance.deleteMany({ item: { $in: ids } }),
        Venda.deleteMany({ item: { $in: ids } }),
    ]);
}

export default {
    status(req, res) {
        res.status(200).json({
            ok: true,
            rotas: {
                popular: 'POST /seed/catalogo',
                limpar: 'DELETE /seed/itens-teste',
            },
            header: 'x-seed-key: vault-seed-dev',
            mongo: mongoose.connection.readyState === 1 ? 'conectado' : 'desconectado',
        });
    },

    async limparItensTeste(req, res) {
        try {
            if (!autorizarSeed(req, res)) return;
            if (!ensureDb(res)) return;

            const itens = await Item.find(filtroItensTeste()).select('_id titulo');
            const ids = itens.map(i => i._id);

            await limparReferenciasItens(ids);
            const resultado = await Item.deleteMany({ _id: { $in: ids } });

            return res.status(200).json({
                mensagem: `${resultado.deletedCount} item(ns) de teste removido(s).`,
                removidos: itens.map(i => ({ id: i._id, titulo: i.titulo })),
            });
        } catch (error) {
            return res.status(500).json({ erro: `Erro ao limpar itens de teste: ${error.message}` });
        }
    },

    async popularCatalogo(req, res) {
        try {
            if (!autorizarSeed(req, res)) return;
            if (!ensureDb(res)) return;

            const donoId = await resolverDono(req);
            if (!donoId) {
                return res.status(400).json({
                    erro: 'Nenhum usuário encontrado. Registre uma conta ou envie donoId no body.',
                });
            }

            const itensTeste = await Item.find(filtroItensTeste()).select('_id');
            const idsTeste = itensTeste.map(i => i._id);
            await limparReferenciasItens(idsTeste);
            await Item.deleteMany({ _id: { $in: idsTeste } });

            const categorias = await garantirCategorias();
            const fonte = Array.isArray(req.body?.itens) && req.body.itens.length
                ? req.body.itens
                : ITENS_SEED;

            const criados = [];

            for (const raw of fonte) {
                const nomeCategoria = raw.categoria;
                const categoriaId = categorias[nomeCategoria];
                if (!categoriaId) {
                    return res.status(400).json({
                        erro: `Categoria '${nomeCategoria}' não suportada no seed.`,
                    });
                }

                const badges = Array.isArray(raw.badges) ? [...raw.badges] : [];
                if (!badges.includes('SEED_VAULT')) badges.push('SEED_VAULT');

                const item = await Item.create({
                    titulo: raw.titulo,
                    descricao: raw.descricao,
                    precoOriginal: raw.precoOriginal,
                    categoria: categoriaId,
                    franquia: raw.franquia || '',
                    subcategoria: raw.subcategoria || '',
                    estado: raw.estado || 'Usado',
                    estoqueQtd: raw.estoqueQtd ?? 1,
                    modelo: raw.modelo || 'normal',
                    troca: raw.troca ?? false,
                    negociacao: raw.negociacao ?? false,
                    badges,
                    imagens: raw.imagens?.length ? raw.imagens : [],
                    especificacoes: raw.especificacoes || [],
                    specRapidas: raw.specRapidas || [],
                    localizacao: raw.localizacao || '',
                    dono: donoId,
                });

                await item.populate('categoria', 'nome slug');
                criados.push(item);
            }

            return res.status(201).json({
                mensagem: `${criados.length} item(ns) adicionado(s) ao catálogo.`,
                dono: donoId,
                itens: criados,
            });
        } catch (error) {
            return res.status(500).json({ erro: `Erro ao popular catálogo: ${error.message}` });
        }
    },
};
