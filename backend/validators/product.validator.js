export function validarCamposObrigatorios(produto) {
  const camposObrigatorios = ["nome", "preco", "descricao"];
  const camposFaltando = [];

  camposObrigatorios.forEach((campo) => {
    if (produto[campo] === undefined ||
      produto[campo] === null ||
      produto[campo].toString().trim() === "") {
      camposFaltando.push(campo)

    }
  })

  if (camposFaltando.length > 0) {
    throw new Error(`Campos obrigatorios não preenchidos: ${camposFaltando.join(", ")} `)
  }
}

export function validarPreco(produto) {
  if (typeof produto.preco !== "number" || produto.preco <= 0) {
    throw new Error("Preço deve ser um número maior que zero!")
  }
}

export function validarEstoque(produto) {
  if (produto.estoque === null || produto.estoque < 0) {
    throw new Error("Estoque não pode ser negativo!");
  }
}
