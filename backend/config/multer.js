import multer from "multer"; // Middleware utilizado para upload de arquivos
import fs from "fs"; // Utilizado para manipular arquivos e pastas
import path from "path"; // Auxiliar no trabalho com caminhos de arquivos
import { randomUUID } from "crypto"; // Gera um ID único de 128 bits (32 caracteres hexadecimais)

// caminhos
const uploadRoot = path.resolve("uploads");
const productDir = path.join(uploadRoot, "products");

// garantir que as pastas existam
// existsSync -> verifica se existe
// mkdirSync -> cria a pasta
// recursive: true -> cria toda a estrutura
if (!fs.existsSync(productDir)) {
  fs.mkdirSync(productDir, { recursive: true });
}

// Configuração do storage ( destino da imagem e o nome dela )
// diskStorage -> é o método que define como e onde os arquivos será salvo
// destination -> é a função que define em qual pasta o arquivo será salvo
// cb -> callback, é uma função passada como argumento para outra função,
// com a intenção de ser executada
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, productDir);
  },

  // filename -> qual será o nome do arquivo salvo
  filename: (req, file, cb) => {
    const data = new Date().toISOString().split("T")[0];

    // função para capturar a extensão do arquivo
    const ext = path.extname(file.originalname);
    // 2026-04-27-uuid.png
    cb(null, `${data}-${randomUUID()}${ext}`)
  }
})

export const upload = multer({
  storage,

  limits: {
    files: 5, // máximo de 5 imagens
    fileSize: 5 * 1024 * 1024 // 5MB
  },

  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];

    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Tipo de arquivo inválido!"));
    }

    cb(null, true);
  }
})
