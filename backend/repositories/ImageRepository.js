import database from "../database/connection.js";

class ImageRepository {
  async getByProductId(productId, connection) {
    const [rows] = await connection.query(
      `SELECT * FROM produto_imagens WHERE produto_id = ?`, [productId]
    );

    return rows;
  }

  async getById(id) {
    const [rows] = await database.query(
      `SELECT * FROM produto_imagens WHERE id = ?`, [id]
    );

    return rows[0];
  }

  async getImageIdsByProductId(productId) {
    const [rows] = await database.query(
      `SELECT id FROM produto_imagens WHERE produto_id = ?`, [productId]
    );

    return rows;
  }

  async createMany(images, connection) {
    const values = images.map((img) => [img.produto_id, img.url, img.ordem]);

    await connection.query(
      `INSERT INTO produto_imagens (produto_id, url, ordem) VALUES ?`, [values]
    )
  }

  async updateUrl(id, url, connection) {
    await connection.query(
      `UPDATE produto_imagens SET url = ? WHERE id = ?`, [url, id]
    )
  }

  async deleteMany(ids, connection) {
    await connection.query(
      `DELETE FROM produto_imagens WHERE id IN (?)`, [ids]
    )
  }
}

export default new ImageRepository();
