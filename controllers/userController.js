import User from "../models/User.js";

export default {
  async listar (req, res) {
    try{
      const usuarios = await User.find();

      return res.status(200).json(usuarios);
    } catch (error) {
      return res.status(500).json(`Erro ao listar usuários. Erro: ${error}`);
    }
  },
  async buscarPorId (req, res){
    try{
      const id = req.params.id;

      const usuario = await User.findById(id);

      if(!usuario) return res.status(404).json({Erro: 'Usuário não encontrado'});
      
      return res.status(200).json(usuario);
    } catch (error){
      return res.status(500).json(`Erro ao buscar usuário. Erro: ${error}`);
    }
  },
  async criar (req, res){
    try{
      const corpo = req.body;

      const novoUsuario = await User.create(corpo);

      return res.status(201).json(novoUsuario);
    } catch (error){
      return res.status(500).json(`Erro ao criar usuário. Erro: ${error}`);
    }
  },
  async atualizar (req, res){
    try{
      const id = req.params.id;

      const atualizacao = req.body;

      const usuario = await User.findById(id);

      if(!usuario) return res.status(404).json({Erro: 'Usuário não encontrado'});

      Object.assign(usuario, atualizacao);

      await usuario.save();

      return res.status(200).json(usuario)
    } catch (error){
      return res.status(500).json(`Erro ao atualizar usuário. Erro: ${error}`);
    }
  },
  async apagar (req, res){
    try{
      const id = req.params.id;

      const usuario = await User.findByIdAndDelete(id);

      if(!usuario) return res.status(404).json({Erro: 'Usuário não encontrado'});
      
      return res.status(200).json('Usuário excluído com sucesso');
    } catch (error){
      return res.status(500).json(`Erro ao excluir usuário. Erro: ${error}`);
    }
  }
};
