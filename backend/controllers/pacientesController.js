import { SimpleCrypto } from "simple-crypto-js";
import * as dotenv from "dotenv";
dotenv.config();

const SECRET = process.env.SECRET;
const entityName = "pacientes";

/* PACIENTES
    "schema": {
        "type": "object",
        "required": [
          "nome", "email", "senha", "fone"
        ],
        "properties": {
          "nome": { "type": "string", "example": "Ana" },
          "senha": { "type": "string", "example": "12345" },
          "email": { "type": "string", "example": "ana@ana.com" }
          "fone": { "type": "string", "example": "(11) 9876-3455" }
        }
      }
*/
function schemaCheck(data, isUpdate = false) {
  if (!data.nome) {
    return "Nome obrigatório";
  }
  if (!isUpdate && !data.senha) {
    return "Senha obrigatório";
  }
  if (!data.email) {
    return "Email obrigatório";
  }
  if (!data.fone) {
    return "Telefone obrigatório";
  }
  return "";
}

export default function controller(server, db) {
  /* GET - recuperar dados */
  server.get(`/${entityName}`, (req, res) => {
    let lista = db.get(`/${entityName}`);
    res.status(200).json(lista);
  });

  server.get(`/${entityName}/:id`, (req, res) => {
    let id = req.params.id;
    let item = db.get(`/${entityName}/${id}`);
    res.status(200).json(item);
  });

  server.get(`/${entityName}/email/:email`, (req, res) => {
    let email = req.params.email;
    //    console.log("passei aqui");
    let lista = db.get(`/${entityName}`);
    for (let id in lista) {
      let paciente = lista[id];
      if (paciente.email == email) {
        res.status(200).json(paciente);
        return;
      }
    }
    res.status(400).json({ msg: "Paciente não existe." });
  });

  /* POST - enviar dados */
  server.post(`/${entityName}`, (req, res) => {
    let id = db.newID("PACIENTE-");
    let data = { id, ...req.body };
    //console.log("data",data);
    let msg = schemaCheck(data);
    if (msg != "") {
      res.status(400).json({ msg });
      return;
    }

    /* Verificar se já existe e-mail cadastrado*/
    let lista = db.get(`/${entityName}`);
    for (let key in lista) {
      if (lista[key].email === data.email) {
        res
          .status(400)
          .json({ msg: "E-mail já cadastrado para outro paciente." });
        return;
      }
    }

    const simpleCrypto = new SimpleCrypto(SECRET);
    data.senha = simpleCrypto.encrypt(data.senha);
    db.set(`/${entityName}/${data.id}`, data);
    res.status(201).json({ msg: "Paciente cadastrado com sucesso.", data });
  });

  /* PUT - atualizar ou substituir dados */
  server.put(`/${entityName}/:id`, (req, res) => {
    let id = req.params.id;
    let elem = db.get(`/${entityName}/${id}`);
    if (elem == null) {
      return res.status(400).json({ msg: "Paciente não existe." });
    }

    let data = { id, ...req.body };
    let msg = schemaCheck(data, true);
    if (msg != "") {
      return res.status(400).json({ msg });
    }

    // Se não foi fornecida uma nova senha, mantém a senha existente
    if (!data.senha) {
      data.senha = elem.senha;
    } else {
      // Recriptografa a senha apenas se uma nova foi fornecida
      const simpleCrypto = new SimpleCrypto(SECRET);
      data.senha = simpleCrypto.encrypt(data.senha);
    }

    db.set(`/${entityName}/${id}`, data);
    res.status(201).json({ msg: "Paciente alterado com sucesso.", data });
  });

  /* DELETE - remover dados */
  server.delete(`/${entityName}/:id`, (req, res) => {
    let id = req.params.id;
    let elem = db.get(`/${entityName}/${id}`);
    if (elem == null) {
      res.status(400).json({ msg: "Paciente não existe." });
      return;
    }
    db.set(`/${entityName}/${id}`, null);
    res.status(201).json({ msg: "Paciente excluído com sucesso." });
  });
}
