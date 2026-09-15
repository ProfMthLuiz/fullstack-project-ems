import CategoryService from "../services/CategoryService.js";

class CategoryController {
  async index(req, res, next) {
    try {
      const categorias = await CategoryService.getAll();

      res.json(categorias);
    } catch (error) {
      next(error);
    }
  }

  async show(req, res, next) {
    try {
      const { id } = req.params;

      const result = await CategoryService.getById(id);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async store(req, res, next) {
    try {
      const result = await CategoryService.create(req.body);

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;

      const result = await CategoryService.update(id, req.body);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async destroy(req, res, next) {
    try {
      const { id } = req.params;

      const result = await CategoryService.delete(id);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new CategoryController();
