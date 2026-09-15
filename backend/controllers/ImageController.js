import ImageService from "../services/ImageService.js";

class ImageController {
  async createMany(req, res, next) {
    try {
      const { id } = req.params;
      const files = req.files;

      const result = await ImageService.createMany(Number(id), files);

      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const file = req.file;

      const result = await ImageService.update(Number(id), file);

      return res.json(result)
    } catch (error) {
      next(error);
    }
  }

  async updateMany(req, res, next) {
    try {
      const { id } = req.params; // id do produto que terá as imagens atualizadas.
      const files = req.files; // as novas imagens do produto.
      const ids = JSON.parse(req.body.ids) // id's das imagens que vão ser atualizadas/substituidas

      const result = await ImageService.updateMany(Number(id), ids, files);

      return res.json(result);

    } catch (error) {
      next(error);
    }
  }

  async destroy(req, res, next) {
    try {
      const productId = Number(req.params.id);
      const { imagensIds } = req.body;

      const result = await ImageService.delete(productId, imagensIds);

      res.json(result);
    } catch (error) {
      next(error)
    }
  }
}

export default new ImageController();
