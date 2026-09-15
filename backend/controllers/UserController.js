import UserService from "../services/UserService.js"

class UserController {
  async forgotPassword(req, res) {
    await UserService.forgotPassword(req.body.email);
    res.json({ message: "Email para recuperar senha enviado! " });
  }

  async resetPassword(req, res) {
    const { token, novaSenha } = req.body;
    await UserService.resetPassword(token, novaSenha);
    res.json({ message: "Senha atualizada com sucesso!" })
  }

  async index(req, res, next) {
    try {
      const users = await UserService.getAll();
      return res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async show(req, res, next) {
    try {
      const { id } = req.params;
      const user = await UserService.getById(id);
      return res.json(user);
    } catch (error) {
      next(error)
    }
  }

  async store(req, res, next) {
    try {
      const result = await UserService.create(req.body);
      return res.status(201).json(result);
    } catch (error) {
      next(error)
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const result = await UserService.update(id, req.body);
      return res.json(result);
    } catch (error) {
      next(error)
    }
  }

  async destroy(req, res, next) {
    try {
      const { id } = req.params;
      const result = await UserService.delete(id);
      return res.json(result)
    } catch (error) {
      next(error)
    }
  }

  async restore(req, res, next) {
    try {
      const { id } = req.params;
      const result = await UserService.restore(id);
      return res.json(result)
    } catch (error) {
      next(error)
    }
  }

}

export default new UserController();
