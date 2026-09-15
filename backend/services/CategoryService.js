import CategoryRepository from "../repositories/CategoryRepository.js";
import CategoryModel from "../models/CategoryModel.js"
import ProductRepository from "../repositories/ProductRepository.js";

class CategoryService {
  async getAll() {
    return await CategoryRepository.getAll();
  }

  async getById(id) {
    if (!id) {
      throw new Error("ID da categoria é obrigatório");
    }

    const categoria = await CategoryRepository.getById(id);

    if (!categoria) {
      throw new Error("Categoria não encontrada");
    }

    return {
      categoria
    };
  }

  async desativar(id) {
    if (!id || isNaN(id)) {
      throw new Error("ID da categoria é obrigatório");
    }

    const categoria = await CategoryRepository.getById(id);

    if (!categoria) {
      throw new Error("Categoria não encontrada");
    }

    // desativa categoria
    await CategoryRepository.updateStatus(id, 0);

    // 🔥 desativa produtos da categoria
    await ProductRepository.desativarPorCategoria(id);

    return {
      message: "Categoria e produtos desativados com sucesso",
    };
  }

  async create(data) {
    if (!data.nome) {
      throw new Error("Nome da categoria é obrigatório");
    }

    const categoria = new CategoryModel(data);

    await CategoryRepository.create(categoria);

    return {
      message: "Categoria criada com sucesso",
    };
  }

  async update(id, data) {
    if (!id) {
      throw new Error("ID da categoria é obrigatório");
    }

    let categoria = await CategoryRepository.getById(id);

    if (!categoria) {
      throw new Error("Categoria não encontrada");
    }

    if (!data.nome) {
      throw new Error("Nome da categoria é obrigatório");
    }

    categoria = new CategoryModel(data);

    await CategoryRepository.update(id, categoria);

    return {
      message: "Categoria atualizada com sucesso",
    };
  }

  async delete(id) {
    if (!id) {
      throw new Error("ID da categoria é obrigatório");
    }

    const categoria = await CategoryRepository.getById(id);

    if (!categoria) {
      throw new Error("Categoria não encontrada");
    }

    await CategoryRepository.delete(id);

    return {
      message: "Categoria removida com sucesso",
    };
  }
}

export default new CategoryService();

