import database from "../database/connection.js";

class CategoryRepository {
  // LISTAR TODAS
  async getAll() {
    const [rows] = await database.query("SELECT * FROM categorias");
    return rows;
  }

  // BUSCAR POR ID
  async getById(id) {
    const [rows] = await database.query(
      "SELECT * FROM categorias WHERE id = ?",
      [id]
    );

    return rows[0];
  }

  // CRIAR
  async create(categoria) {

    const [result] = await database.query(
      "INSERT INTO categorias (nome, descricao, status) VALUES (?, ?, ?)",
      [categoria.nome, categoria.descricao, categoria.status]
    );

    return result.insertId;
  }

  // ATUALIZAR
  async update(id, categoria) {

    const [result] = await database.query(
      `UPDATE categorias
       SET nome = ?, descricao = ?, status = ?
       WHERE id = ?`,
      [categoria.nome, categoria.descricao, categoria.status, id]
    );

    return result.affectedRows;
  }

  // VERIFICAR SE TEM PRODUTOS
  async hasProducts(categoriaId) {
    const [rows] = await database.query(
      "SELECT COUNT(*) as total FROM produtos WHERE categoria_id = ?",
      [categoriaId]
    );

    return rows[0].total > 0;
  }

  // DELETAR
  async delete(id) {
    const [result] = await database.query(
      "DELETE FROM categorias WHERE id = ?",
      [id]
    );

    return result.affectedRows;
  }
}

export default new CategoryRepository();
