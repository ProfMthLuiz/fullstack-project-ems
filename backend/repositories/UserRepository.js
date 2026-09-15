import database from "../database/connection.js";

class UserRepository {
  async getByEmail(email) {
    const [rows] = await database.query("SELECT * FROM usuarios WHERE email = ?", [email]);

    if (!rows[0]) return null;

    return rows[0];
  }

  async saveResetToken(userId, token, expires) {
    await database.query(`
     UPDATE usuarios
     SET token_recuperacao = ?, token_recuperacao_expira = ?
     WHERE id = ?`,
      [token, expires, userId]
    )
  }

  async findByResetToken(token) {
    const [rows] = await database.query(
      `SELECT * FROM usuarios WHERE token_recuperacao = ? LIMIT 1`,
      [token]
    )

    return rows[0]
  }

  async updatePassword(id, senhaHash) {
    const [rows] = await database.query(
      "UPDATE usuarios SET senha = ? WHERE id = ?",
      [senhaHash, id]
    )

    return rows.affectedRows;
  }

  async clearResetToken(userId) {
    await database.query(`
      UPDATE usuarios
      SET token_recuperacao = NULL, token_recuperacao_expira = NULL
      WHERE id = ?`,
      [userId]
    );
  }

  async getAll() {
    const [rows] = await database.query("SELECT id, nome, email, role, status FROM usuarios")
    return rows;
  }

  async getById(id) {
    const [rows] = await database.query("SELECT id, nome, email, role, status FROM usuarios WHERE id = ?", [id])
    return rows[0];
  }

  async create(data) {
    const { nome, email, senha, role, token_verificacao, token_expiracao } = data;

    const [result] = await database.query(`
      INSERT INTO usuarios
      (nome, email, senha, role, status, token_verificacao, token_verificacao_expira)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nome, email, senha, role, 1, token_verificacao, token_expiracao]
    )

    return result;
  }

  async findByVerificationToken(tokenHash) {
    const [rows] = await database.query(
      `SELECT * FROM usuarios WHERE token_verificacao = ? LIMIT 1`, [tokenHash]
    )

    return rows[0]
  }

  async updateVerification(userId, data) {
    const [result] = await database.query(`
      UPDATE usuarios
      SET email_verificado = ?,
          token_verificacao = ?,
          token_verificacao_expira = ?
      WHERE id = ?`,
      [
        data.email_verificado,
        data.token_verificacao,
        data.token_verificacao_expira,
        userId
      ]
    )

    return result;
  }

  async update(id, data) {
    const { nome, email, role, status } = data;

    const [rows] = await database.query(
      `UPDATE usuarios
      SET nome = ?, email = ?, role = ?, status = ?
      WHERE id = ?`,
      [nome, email, role, status, id]
    );

    return rows.affectedRows;
  }

  async delete(id) {
    await database.query(`UPDATE usuarios SET status = 0 WHERE id = ?`, [id]);

    return true;
  }

  async restore(id) {
    await database.query(`UPDATE usuarios SET status = 1 WHERE id = ?`, [id]);

    return true;
  }
}

export default new UserRepository();
