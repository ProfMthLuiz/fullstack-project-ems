class Product {
  constructor({
    nome,
    descricao,
    preco,
    quantidade_estoque,
    status,
    destaque,
    marca,
    modelo,
    garantia_meses,
    categoria_id }) {
    this.nome = nome;
    this.descricao = descricao;
    this.preco = preco;
    this.quantidade_estoque = quantidade_estoque;
    this.status = status;
    this.destaque = destaque;
    this.marca = marca;
    this.modelo = modelo;
    this.garantia_meses = garantia_meses;
    this.categoria_id = categoria_id;
  }
}

export default Product;
