import ProductModel from "../models/ProductModel.js";
import ProductRepository from "../repositories/ProductRepository.js";
import CategoriaRepository from "../repositories/CategoryRepository.js"
import { validarCamposObrigatorios, validarPreco, validarEstoque } from "../validators/product.validator.js"

class ProductService {
  async getAll(page = 1, limit = 10, search = '') {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const offset = (pageNum - 1) * limitNum;

    const { produtos, total } = await ProductRepository.getPaginated(limitNum, offset, search);
    const totalPages = Math.ceil(total / limitNum) || 1;

    return {
      data: produtos,
      pagination: {
        totalItems: total,
        totalPages,
        currentPage: pageNum,
        itemsPerPage: limitNum
      }
    };
  }

  async getById(id) {
    if (!id) {
      throw new Error("ID do Produto é obrigatório")
    }

    const produto = await ProductRepository.getById(id)

    if (!produto) {
      throw new Error("Produto não encontrado")
    }

    return {
      produto
    };
  }

  async create(data) {
    validarCamposObrigatorios(data);
    validarPreco(data);
    validarEstoque(data);

    let categoria = await CategoriaRepository.getById(data.categoria_id);

    if (!categoria) {
      throw new Error("Categoria não existe!")
    }

    if (categoria.status === 0) {
      throw new Error("Não é possível cadastrar produto em categoria desativada!")
    }

    if (data.destaque) {
      const totalDestaques = await ProductRepository.countDestaques();

      if (totalDestaques >= 5) {
        throw new Error("Limite de produtos em destaque foi atingido!")
      }
    }

    // Model -> Cuida da estrutura dos dados
    const produto = new ProductModel(data);

    // Repository -> Cuida do banco (INSERT, UPDATE, SELECT)
    await ProductRepository.createProduct(produto);

    return {
      message: "Produto criado com sucesso",
    };
  }

  async update(id, data) {
    if (!id) {
      throw new Error("ID do Produto é obrigatório")
    }

    const produtoAtual = await ProductRepository.getById(id);

    if (!produtoAtual) {
      throw new Error("Produto não encontrado!")
    }

    if (data.categoria_id) {
      const categoria = await CategoriaRepository.getById(data.categoria_id)

      if (!categoria || categoria.status === 0) {
        throw new Error("Categoria inválida ou desativada!")
      }
    }

    validarCamposObrigatorios(data);
    validarPreco(data);
    validarEstoque(data);

    if (data.destaque && !produtoAtual.destaque) {
      const totalDestaques = await ProductRepository.countDestaques();

      if (totalDestaques >= 5) {
        throw new Error("Limite de produtos em destaque foi atingido!")
      }
    }

    // Model -> Cuida da estrutura dos dados
    const produto = new ProductModel(data);

    // Repository -> Cuida do banco (INSERT, UPDATE, SELECT)
    await ProductRepository.updateProduct(id, produto);

    return {
      message: "Produto atualizado com sucesso",
    };
  }

  async delete(id) {
    if (!id) {
      throw new Error("ID do Produto é obrigatório")
    }

    const produto = await ProductRepository.getById(id)

    if (!produto) {
      throw new Error("Produto não encontrado")
    }

    await ProductRepository.deleteProduct(id)

    return {
      message: "Produto deletado com sucesso",
    };
  }
}

export default new ProductService();
