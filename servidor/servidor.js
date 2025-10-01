import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
// import pdfsRouter from "./router/pdfsRouter.js";
import cors from "cors";

const app = express();
app.use(cors());

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);
const pdfRoot = path.join(__dirname, "pdfs");

app.use("/pdfs", express.static(pdfRoot));


// Função para listar recursivamente os diretórios e arquivos
function listarArquivos(dir, baseUrl) {
  const result = {};
  const items = fs.readdirSync(dir);
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.lstatSync(fullPath);

    if (stat.isDirectory()) {
      result[item] = listarArquivos(fullPath, baseUrl + "/" + item);
    } else if (item.toLowerCase().endsWith(".pdf")) {

      if (!result.files) result.files = [];
      result.files.push({
        name: item,
        url: baseUrl + "/" + item
      });
    }
  });

  return result;
}

// Endpoint que retorna a estrutura de PDFs em JSON
app.get("/api/pdfs",  (req, res) =>{
  const estrutura = listarArquivos(pdfRoot, req.protocol + "://" + req.get("host") + "/pdfs");
  res.json(estrutura);
});

app.use(express.static('../site_totem'));
app.use(express.json());

// app.use(pdfsRouter);

app.listen(3100, () => {
  console.log('Servidor rodando em http://localhost:3100');
});