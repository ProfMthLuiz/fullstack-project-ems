import database from "../database/connection.js";

class ProductRepository {
  async getAll() {
    const [rows] = await database.query("SELECT * FROM produtos");
    return rows;
  }

  async getPaginated(limit, offset, search = "") {
    // 1. Garante que limit e offset sejam números inteiros
    const parsedLimit = parseInt(limit, 10) || 10;
    const parsedOffset = parseInt(offset, 10) || 0;

    let sql = `
    SELECT
      p.*,
      c.nome AS categoria
    FROM produtos p
    INNER JOIN categorias c ON c.id = p.categoria_id
  `;

    let countSql = `
    SELECT COUNT(*) AS total
    FROM produtos p
    INNER JOIN categorias c ON c.id = p.categoria_id
  `;

    const params = [];
    const countParams = [];

    if (search && search.trim() !== "") {
      const term = `%${search.trim()}%`;
      const whereClause = `
      WHERE p.nome LIKE ?
      OR c.nome LIKE ?
    `;

      sql += whereClause;
      countSql += whereClause;

      params.push(term, term);
      countParams.push(term, term);
    }

    // 2. ADICIONADO: ORDER BY p.id ASC garante a sequência por ID do menor para o maior
    sql += " ORDER BY p.id ASC LIMIT ? OFFSET ?";
    params.push(parsedLimit, parsedOffset);

    const [rows] = await database.query(sql, params);
    const [countRows] = await database.query(countSql, countParams);

    return {
      produtos: rows,
      total: countRows[0] ? countRows[0].total : 0,
    };
  }

  async getById(id) {
    const [rows] = await database.query("SELECT * FROM produtos WHERE id = ?", [
      id,
    ]);
    return rows[0];
  }

  async desativarPorCategoria(categoriaId) {
    await database.query(
      "UPDATE produtos SET status = 0 WHERE categoria_id = ?",
      [categoriaId],
    );
  }

  async countByCategoria(categoriaId) {
    const [rows] = await database.query(
      "SELECT COUNT(*) as total FROM produtos WHERE categoria_id = ?",
      [categoriaId],
    );
    return rows[0].total;
  }

  async countDestaques() {
    const [rows] = await database.query(
      "SELECT COUNT(*) as total FROM produtos WHERE destaque = 1",
    );
    return rows[0].total;
  }

  async createProduct(produto) {
    const [result] = await database.query(
      `INSERT INTO produtos (
      nome, descricao, preco, quantidade_estoque, status, destaque, marca, modelo, garantia_meses, categoria_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        produto.nome,
        produto.descricao,
        produto.preco,
        produto.quantidade_estoque,
        produto.status,
        produto.destaque,
        produto.marca,
        produto.modelo,
        produto.garantia_meses,
        produto.categoria_id,
      ],
    );

    return result.insertId;
  }

  async updateProduct(id, produto) {
    const [result] = await database.query(
      `UPDATE produtos SET
      nome = ?,
      descricao = ?,
      preco = ?,
      quantidade_estoque = ?,
      status = ?,
      destaque = ?,
      marca = ?,
      modelo = ?,
      garantia_meses = ?,
      categoria_id = ?
      WHERE id = ?
      `,
      [
        produto.nome,
        produto.descricao,
        produto.preco,
        produto.quantidade_estoque,
        produto.status,
        produto.destaque,
        produto.marca,
        produto.modelo,
        produto.garantia_meses,
        produto.categoria_id,
        id,
      ],
    );

    return result.affectedRows;
  }

  async deleteProduct(id) {
    const [result] = await database.query(`DELETE FROM produtos WHERE id = ?`, [
      id,
    ]);
    return result.affectedRows;
  }
}

export default new ProductRepository();
