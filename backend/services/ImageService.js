import ProductRepository from "../repositories/ProductRepository.js"
import ImageRepository from "../repositories/ImageRepository.js";
import db from "../database/connection.js"
import path from "path";
import fs from "fs";

class ImageService {
  async createMany(productId, files) {
    const connection = await db.getConnection();
    const savedFiles = [];

    if (!files || files.length === 0) {
      throw new Error("Nenhuma imagem enviada!");
    }

    try {
      // Iniciando a transação, a partir daqui nada é definitivo AINDA.
      await connection.beginTransaction();

      const product = await ProductRepository.getById(productId);

      if (!product) {
        throw new Error("Produto não encontrado!")
      }

      const imagensAtuais = await ImageRepository.getByProductId(productId, connection);
      let ordemInicial = imagensAtuais.length;

      const imagens = files.map((file, index) => {
        const url = `uploads/products/${file.filename}`;

        savedFiles.push(path.resolve("uploads/products", file.filename));

        return {
          produto_id: productId,
          url,
          ordem: ordemInicial + index
        }
      })

      await ImageRepository.createMany(imagens, connection);

      await connection.commit();

      return { message: "Imagens adicionadas com sucesso!" }

    } catch (error) {
      await connection.rollback();
      // filePath = "/uploads/products/img1.jpg"
      // filePath = "/uploads/products/img2.jpg"
      // filePath = "/uploads/products/img3.jpg"
      // for of -> Percorre os valores de uma coleção, lista.
      // Para cada valor dentro do array savedFiles, coloque esse
      // valor na variável filePath
      for (const filePath of savedFiles) {
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath)
        }
      }

      throw new Error("Erro ao adicionar imagens!")
    } finally {
      // Libera a conexão com o banco
      connection.release();
    }
  }

  async update(idImagem, file) {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const imagem = await ImageRepository.getById(idImagem);

      if (!imagem) {
        throw new Error("Imagem não encontrada!");
      }

      const oldFileName = path.basename(imagem.url);
      const oldFilePath = path.resolve(
        process.cwd(),
        "uploads",
        "products",
        oldFileName
      );

      const newUrl = `uploads/products/${file.filename}`;

      await ImageRepository.updateUrl(idImagem, newUrl, connection);

      await connection.commit();

      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath)
      }

      return { message: "Imagem atualizada com sucesso!" }
    } catch (error) {
      await connection.rollback();

      if (file) {
        const newFilePath = path.resolve(
          process.cwd(),
          "uploads",
          "products",
          file.filename
        );

        if (fs.existsSync(newFilePath)) {
          fs.unlinkSync(newFilePath)
        }
      }

      throw new Error("Erro ao atualizar imagem!")
    } finally {
      // Libera a conexão com o banco
      connection.release();
    }
  }

  async updateMany(produtoId, ids, files) {
    const connection = await db.getConnection();
    const oldFiles = [];
    const newFiles = [];

    try {
      await connection.beginTransaction();

      if (!files || files.length === 0) {
        throw new Error("Imagens são obrigatórias!")
      }

      if (!ids || ids.length !== files.length) {
        throw new Error("Quantidade de Imagens e IDs deve ser igual")
      }

      for (let i = 0; i < ids.length; i++) {
        const imagemId = ids[i];
        const file = files[i];

        const imagem = await ImageRepository.getById(imagemId);

        if (!imagem) {
          throw new Error(`Imagem ${imagemId} não encontrada!`)
        }

        if (imagem.produto_id !== produtoId) {
          throw new Error(`Imagem ${imagemId} não pertence ao produto`)
        }

        const oldFileName = path.basename(imagem.url);
        const oldFilePath = path.resolve(
          process.cwd(),
          "uploads",
          "products",
          oldFileName
        );

        oldFiles.push(oldFilePath);

        const newUrl = `uploads/products/${file.filename}`;

        newFiles.push(path.resolve(process.cwd(), "uploads", "products", file.filename));

        await ImageRepository.updateUrl(imagemId, newUrl, connection);
      }

      await connection.commit();

      // for of -> estrutura de repetição, ele percorre de forma simples e direta os valores da lista
      // neste caso, esta percorrendo nossa lista oldFiles para deletar os arquivos antigos
      for (const filePath of oldFiles) {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      return { message: "Imagens atualizadas com sucesso!" }

    } catch (error) {
      await connection.rollback();

      for (const filePath of newFiles) {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      throw new Error("Erro ao atualizar as imagens do produto!")

    } finally {
      // Libera a conexão com o banco
      connection.release();
    }
  }

  async delete(productId, imagensIds) {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      if (!imagensIds || imagensIds.length === 0) {
        throw new Error("Nenhuma imagem informada para remoção!")
      }

      const imagens = await ImageRepository.getByProductId(productId, connection);
      console.log("IMAGENS INTERLIGADAS AO PRODUTO: ", imagens)

      const imagensParaRemover = imagens.filter((img) => imagensIds.includes(img.id));
      console.log("IMAGENS FILTRADAS QUE VÃO SER REMOVIDAS: ", imagensParaRemover)

      if (imagensParaRemover.length === 0) {
        throw new Error("Imagens não encontradas para este produto!")
      }

      for (const img of imagensParaRemover) {
        const filePath = path.resolve(process.cwd(), "uploads", "products", path.basename(img.url))
        console.log("Tentando remover:", filePath)
        console.log(fs.existsSync(filePath))
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
        }
      }

      await ImageRepository.deleteMany(imagensIds, connection);

      await connection.commit();

      return { message: "Imagens removidas com sucesso!" }

    } catch (error) {
      await connection.rollback();
      throw new Error("Erro ao excluir imagem(s) do produto!")
    } finally {
      connection.release();
    }
  }
}

export default new ImageService();
