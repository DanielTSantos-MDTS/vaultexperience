import Item from "../models/Iten.js";
import User from "../models/User.js";
import Categoria from "../models/Categoria.js";
import redisClient from "../redis/configRedis.js";

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

            const itemDB = await Item.findById(id)
            .populate('dono', 'username')
            .populate('categoria', 'titulo');

            if (!itemDB) return res.status(404).json({Erro: 'Item não encontrado'});

            const item = {
            id: itemDB._id,
            titulo: itemDB.titulo,
            descricao: itemDB.descricao,
            precoOriginal: itemDB.precoOriginal,
            precoAtual: itemDB.precoOriginal, 
            categoria: itemDB.categoria?.nome || 'Sem Categoria',
            subcategoria: itemDB.franquia || 'Diversos',
            slug: itemDB.titulo.toLowerCase().replace(/ /g, '-'),
            imagens: itemDB.imagens && itemDB.imagens.length > 0 ? itemDB.imagens : ["https://placehold.co/600x600/1a1a1a/555555?text=Sem+Foto"],
            
            // Dados fixos de segurança para a tela não quebrar:
            condicoes: ["Seminovo", "Usado", "Novo"],
            condicaoAtiva: itemDB.estado || "Usado",
            estoqueStatus: "in",
            estoqueQtd: 10,
            estoqueMax: 10,
            parcelas: 12,
            valorParcela: (itemDB.precoOriginal / 12).toFixed(2),
            desconto: 0,
            
            vendedor: {
                nome: itemDB.dono?.username || 'Vendedor Anônimo',
                inicial: itemDB.dono?.username ? itemDB.dono.username.charAt(0).toUpperCase() : 'V',
                verificado: true
            },
            
            // Estruturas complexas (enviamos vazias ou simples para não travar os botões)
            especificacoes: itemDB.especificacoes || [],
            specsRapidas: [], 
            tags: [itemDB.categoria?.nome],
            badges: [],
            descricaoCompleta: [{ titulo: "Sobre o produto", tipo: "paragrafo", conteudo: itemDB.descricao }],
            
            // Dados das Estrelinhas
            avaliacaoMedia: 5,
            avaliacaoTotal: 1,
            distribuicaoEstrelas: [{ estrelas: 5, pct: 100 }],
            reviews: []
        };

            return res.status(200).json(item);
        } catch (error) {
            res.status(500).json(`Erro ao buscar item. Erro: ${error}`);
        }
    },
    async filtroRedis(req, res){
        try{
            const filter = req.query.filtro;

            const filterString = 'categoria_' + filter;
         
            const filterExist = await redisClient.get(filterString);
            
            if(filterExist){
                const filterJson = JSON.parse(filterExist);

                return res.status(200).json(filterJson);
            }

            const categoryFilter = await Categoria.findOne({
                nome: filter
            });

            if (!categoryFilter){
                return res.status(404).json({Error: `Categoria não encontrada`});
            }

            const filterDB = await Item.find({categoria: categoryFilter._id});
            
            await redisClient.setEx(filterString, 3600, JSON.stringify(filterDB));

            return res.status(200).json(filterDB);
        } catch(error){
            return res.status(500).json({Error: `Erro ao filtrar`});
        }
    },
    async criar (req, res) {
        try{
            const corpo = req.body;

            corpo.dono = req.id;

            const nomeCategoria = corpo.categoria;

            const categoryId = await Categoria.findOne({nome: nomeCategoria});

            if (!categoryId){
                return res.status(404).json({Erro: `Categoria '${nomeCategoria}' não encontrada`});
            }

            corpo.categoria = categoryId._id;;
            
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