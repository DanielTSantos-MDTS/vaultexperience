import User from "../models/User.js";

export default {
  async listar (req, res) {
    try{
      const usuarios = await User.find()
      .populate('reputacao', 'label');

      return res.status(200).json(usuarios);
    } catch (error) {
      return res.status(500).json(`Erro ao listar usuários. Erro: ${error}`);
    }
  },
  async buscarPorId (req, res){
    try{
      const id = req.params.id;

      const usuario = await User.findById(id)
      .populate('reputacao', 'label');

      
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

      await novoUsuario.populate('reputacao', 'label');
      
      return res.status(201).json(novoUsuario);
    } catch (error){
      return res.status(500).json(`Erro ao criar usuário. Erro: ${error}`);
    }
  },
  async atualizar (req, res){
    try{
      const id = req.params.id;

      if (req.id !== id) {
        return res.status(403).json({ erro: 'Você só pode alterar seu próprio perfil' });
      }

      const usuario = await User.findById(id);

      if(!usuario) return res.status(404).json({Erro: 'Usuário não encontrado'});

      const { nome, sobrenome, username, contatoPrincipal, password, dataNascimento } = req.body;

      if (nome != null) usuario.nome = nome;
      if (sobrenome != null) usuario.sobrenome = sobrenome;
      if (username != null) usuario.username = username;
      if (contatoPrincipal != null) usuario.contatoPrincipal = contatoPrincipal;
      if (dataNascimento != null) usuario.dataNascimento = dataNascimento;
      if (password) usuario.password = password;

      await usuario.save();

      await usuario
      .populate('reputacao', 'label');

      return res.status(200).json(usuario)
    } catch (error){
      return res.status(500).json({Erro: `Erro ao atualizar usuário. Erro: ${error.message}`});
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
