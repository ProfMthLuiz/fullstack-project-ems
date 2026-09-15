// middleware -> é uma função que vai "fica no meio caminho"
// entre a requisição do usuário (request) e a resposta do servidor (response)
function errorHandler(err, req, res, next) {
  console.error(err);

  res.status(400).json({
    error: err.message
  });
}

export default errorHandler
