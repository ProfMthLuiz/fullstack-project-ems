import ProductService from "../services/ProductService.js";

class ProductController {
  async index(req, res, next) {
    try {
      const { page, limit, search } = req.query;
      const result = await ProductService.getAll(page, limit, search);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async show(req, res, next) {
    try {
      const { id } = req.params;

      const result = await ProductService.getById(id);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async store(req, res, next) {
    try {
      const result = await ProductService.create(req.body);

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;

      const result = await ProductService.update(id, req.body);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async destroy(req, res, next) {
    try {
      const { id } = req.params;

      const result = await ProductService.delete(id);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductController();
