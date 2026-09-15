class Category {
  constructor({ id = null, nome, descricao = null, status = 1 }) {
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
    this.status = status;
  }
}

export default Category;
