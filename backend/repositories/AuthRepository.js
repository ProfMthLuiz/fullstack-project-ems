import database from "../database/connection.js";

class AuthRepository {
  async create({ user_id, token, expires_at }) {
    const [result] = await database.query(`INSERT INTO refresh_tokens (user_id, token, expires_at)
      VALUES (?, ?, ?)
      `, [user_id, token, expires_at])

    return result.insertId;
  }

  async findByToken(token) {
    const [rows] = await database.query(`SELECT * FROM refresh_tokens WHERE token = ? LIMIT 1`, [token])

    if (!rows.length) return null;

    return rows[0];
  }

  async deleteByToken(token) {
    await database.query(`DELETE FROM refresh_tokens WHERE token = ?`, [token])
  }
}

export default new AuthRepository();
