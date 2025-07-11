import { SimpleCrypto } from "simple-crypto-js";
import * as dotenv from "dotenv";
dotenv.config();

const SECRET = process.env.SECRET;
const entityName = "profissionais";

/* PROFISSIONAIS
     "schema": {
              "type": "object",
              "required": [
                "nome",
                "email",
                "senha",
                "fone",
                "especialidade",
                "descricao",
                "cro"
              ],
              "properties": {
                "nome": { "type": "string", "example": "Dr. João" },
                "senha": { "type": "string", "example": "12345" },
                "email": { "type": "string", "example": "drjoao@clinica.com" },
                "fone": { "type": "number", "example": "(11) 9876-3455" },
                "especialidade": {
                  "type": "string",
                  "example": "Endodontia"
                },
                "descricao": {
                  "type": "string",
                  "example": "Especialista em canais"
                },
                "cro": { "type": "string", "example": "56789-SP" }
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
  if (!data.especialidade) {
    return "Especialidade obrigatório";
  }
  if (!data.descricao) {
    return "Descrição obrigatório";
  }
  if (!data.cro) {
    return "CRO obrigatório";
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

    let lista = db.get(`/${entityName}`);
    for (let id in lista) {
      let profissional = lista[id];
      if (profissional.email == email) {
        res.status(200).json(profissional);
        return;
      }
    }
    res.status(400).json({ msg: "Profissional  não existe." });
  });

  /* POST - enviar dados */
  server.post(`/${entityName}`, (req, res) => {
    let id = db.newID("PROFISSIONAL-");
    let data = { id, ...req.body };

    let msg = schemaCheck(data);
    if (msg != "") {
      res.status(400).json({ msg });
      return;
    }

    /* Verificar se já existe e-mail ou um CRO cadastrado*/
    let lista = db.get(`/${entityName}`);
    for (let key in lista) {
      let profissional = lista[key];
      if (profissional.email === data.email) {
        res
          .status(400)
          .json({ msg: "E-mail já cadastrado para outro profissional." });
        return;
      }
      if (profissional.cro === data.cro) {
        res
          .status(400)
          .json({ msg: "CRO já cadastrado para outro profissional." });
        return;
      }
    }

    const simpleCrypto = new SimpleCrypto(SECRET);
    data.senha = simpleCrypto.encrypt(data.senha);
    db.set(`/${entityName}/${data.id}`, data);
    res.status(201).json({ msg: "Profissional cadastrado com sucesso.", data });
  });

  /* PUT - atualizar ou substituir dados */
  server.put(`/${entityName}/:id`, (req, res) => {
    let id = req.params.id;
    let elem = db.get(`/${entityName}/${id}`);
    if (elem == null) {
      res.status(400).json({ msg: "Profissional não existe." });
      return;
    }
    let data = { id, ...req.body };
    let msg = schemaCheck(data, true);
    if (msg != "") {
      res.status(400).json({ msg });
      return;
    }

    // Mantém a senha existente, não permitindo alteração
    data.senha = elem.senha;

    db.set(`/${entityName}/${data.id}`, data);
    res.status(201).json({ msg: "Profissional alterado com sucesso.", data });
  });

  /* DELETE - remover dados */
  server.delete(`/${entityName}/:id`, (req, res) => {
    let id = req.params.id;
    let elem = db.get(`/${entityName}/${id}`);
    if (elem == null) {
      res.status(400).json({ msg: "Profissional  não existe." });
      return;
    }
    db.set(`/${entityName}/${id}`, null);
    res.status(201).json({ msg: "Profissional excluído com sucesso." });
  });
}
