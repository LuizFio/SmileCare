import { SimpleCrypto } from "simple-crypto-js";
import * as dotenv from "dotenv";
dotenv.config();

const SECRET = process.env.SECRET;
const entityName = "procedimentos";

/* PROCEDIMENTOS
      "schema": {
              "type": "object",
              "required": ["nome", "descricao", "idProfissionais"],
              "properties": {
                "nome": {
                  "type": "string",
                  "example": "Cirurgia do dente do siso"
                },
                "descricao": {
                  "type": "string",
                  "example": "Remoção do dente do siso"
                },
                "idProfissionais": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "example": "PROFISSIONAL-5oaN0"
                  }
                }
              }
            }
*/
function schemaCheck(data) {
  if (!data.nome) {
    return "Nome obrigatório";
  }
  if (!data.descricao) {
    return "Descrição obrigatória";
  }
  if (
    !data.idProfissionais ||
    !Array.isArray(data.idProfissionais) ||
    data.idProfissionais.length === 0
  ) {
    return "Pelo menos um profissional é obrigatório";
  }
  return "";
}

export default function controller(server, db) {
  /* GET - Listar procedimentos com profissionais */
  server.get(`/${entityName}`, (req, res) => {
    const procedimentos = db.get(`/${entityName}`) || {};
    const profissionais = db.get(`/profissionais`) || {};

    const lista = {};
    for (const id in procedimentos) {
      const proc = procedimentos[id];
      // Para cada procedimento, busca os profissionais vinculados pelo id
      const profs = (proc.idProfissionais || [])
        .map((pid) => profissionais[pid])
        .filter(Boolean);

      lista[id] = {
        ...proc,
        profissionais: profs,
      };
    }

    res.status(200).json(lista);
  });

  /* GET - Buscar procedimento por ID */
  server.get(`/${entityName}/:id`, (req, res) => {
    const { id } = req.params;
    const procedimento = db.get(`/${entityName}/${id}`);

    if (!procedimento) {
      return res
        .status(404)
        .json({ error: true, msg: "Procedimento não encontrado" });
    }

    const profissionais = db.get(`/profissionais`) || {};
    const profs = (procedimento.idProfissionais || [])
      .map((pid) => profissionais[pid])
      .filter(Boolean);

    res.status(200).json({
      ...procedimento,
      profissionais: profs,
    });
  });

  /* POST - Criar novo procedimento */
  server.post(`/${entityName}`, (req, res) => {
    const data = req.body;

    // Validação básica
    const msgErro = schemaCheck(data);
    if (msgErro) {
      return res.status(400).json({ error: true, msg: msgErro });
    }

    // Verificar se já existe procedimento com mesmo nome (case insensitive)
    const procedimentos = db.get(`/${entityName}`) || {};
    const nomeExiste = Object.values(procedimentos).some(
      (p) => p.nome.toLowerCase() === data.nome.toLowerCase()
    );
    if (nomeExiste) {
      return res
        .status(400)
        .json({ error: true, msg: "Já existe um procedimento com esse nome" });
    }

    // Verificar se todos os profissionais enviados existem
    const profissionais = db.get(`/profissionais`) || {};
    for (const pid of data.idProfissionais) {
      if (!profissionais[pid]) {
        return res
          .status(400)
          .json({ error: true, msg: `Profissional inválido: ${pid}` });
      }
    }

    // Criar ID e salvar
    const id = db.newID("PROCEDIMENTO-");
    procedimentos[id] = {
      id,
      nome: data.nome,
      descricao: data.descricao,
      idProfissionais: data.idProfissionais,
      profissionais: [], // Pode manter vazio ou preencher depois se quiser
    };

    db.set(`/${entityName}`, procedimentos);

    res.status(201).json({ msg: "Procedimento criado com sucesso", id });
  });

  /* PUT - Atualizar procedimento */
  server.put(`/${entityName}/:id`, (req, res) => {
    const { id } = req.params;
    const data = req.body;

    const procedimentos = db.get(`/${entityName}`) || {};
    const procedimento = procedimentos[id];
    if (!procedimento) {
      return res
        .status(404)
        .json({ error: true, msg: "Procedimento não encontrado" });
    }

    // Mesclar dados para validação
    const dadosAtualizados = {
      ...procedimento,
      ...data,
    };

    const msgErro = schemaCheck(dadosAtualizados);
    if (msgErro) {
      return res.status(400).json({ error: true, msg: msgErro });
    }

    // Validar profissionais enviados
    if (dadosAtualizados.idProfissionais) {
      const profissionais = db.get(`/profissionais`) || {};
      for (const pid of dadosAtualizados.idProfissionais) {
        if (!profissionais[pid]) {
          return res
            .status(400)
            .json({ error: true, msg: `Profissional inválido: ${pid}` });
        }
      }
    }

    // Verificar nome duplicado em outro procedimento
    const nomeExiste = Object.values(procedimentos).some(
      (p) =>
        p.nome.toLowerCase() === dadosAtualizados.nome.toLowerCase() &&
        p.id !== id
    );
    if (nomeExiste) {
      return res.status(400).json({
        error: true,
        msg: "Já existe outro procedimento com esse nome",
      });
    }

    // Atualizar
    procedimentos[id] = {
      ...procedimento,
      ...data,
    };

    db.set(`/${entityName}`, procedimentos);

    res.status(200).json({ msg: "Procedimento atualizado com sucesso" });
  });

  /* DELETE - Remover procedimento */
  server.delete(`/${entityName}/:id`, (req, res) => {
    const { id } = req.params;
    const procedimentos = db.get(`/${entityName}`) || {};

    if (!procedimentos[id]) {
      return res
        .status(404)
        .json({ error: true, msg: "Procedimento não encontrado" });
    }

    delete procedimentos[id];
    db.set(`/${entityName}`, procedimentos);

    res.status(200).json({ msg: "Procedimento removido com sucesso" });
  });
}
