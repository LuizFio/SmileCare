import { SimpleCrypto } from "simple-crypto-js";
import * as dotenv from "dotenv";
dotenv.config();

const SECRET = process.env.SECRET;
const entityName = "agendamentos";

/* AGENDAMENTOS
AGENDAMENTOS
  "schema": {
    "type": "object",
    "required": [
      "data", "horario", "idPaciente", "idProcedimento", "idProfissional"
    ],
    "properties": {
      "data": {
        "type": "string",
        "example": "01/07/2025",
        "description": "Data do agendamento no formato brasileiro (dd/MM/yyyy)"
      },
      "horario": {
        "type": "string",
        "example": "15:30",
        "description": "Horário do agendamento no formato 24h (HH:mm)"
      },
      "idPaciente": {
        "type": "string",
        "example": "",
        "description": "ID do paciente previamente cadastrado"
      },
      "idProcedimento": {
        "type": "string",
        "example": "",
        "description": "ID do procedimento previamente cadastrado"
      },
      "idProfissional": {
        "type": "string",
        "example": "",
        "description": "ID do profissional previamente cadastrado"
      },
      "status": {
        "type": "string",
        "enum": ["pendente", "confirmada", "concluída", "cancelada"],
        "example": "pendente",
        "description":  "Status atual do agendamento. Será 'pendente' por padrão e poderá ser alterado apenas por um profissional."
      }
    }
  }
*/
function schemaCheck(data) {
  if (!data.data) {
    return "Data obrigatório";
  }
  if (!data.horario) {
    return "Horário obrigatório";
  }
  if (!data.idPaciente) {
    return "Paciente obrigatório";
  }
  if (!data.idProcedimento) {
    return "Procedimento obrigatório";
  }
  if (!data.idProfissional) {
    return "Profissional obrigatório";
  }
  return "";
}

export default function controller(server, db) {
  // GET - listar todos com dados completos
  server.get(`/${entityName}`, (req, res) => {
    let lista = db.get(`/${entityName}`);
    for (let id in lista) {
      let agenda = lista[id];
      let paciente = db.get(`/pacientes/${agenda.idPaciente}`);
      let profissional = db.get(`/profissionais/${agenda.idProfissional}`);
      let procedimento = db.get(`/procedimentos/${agenda.idProcedimento}`);
      
      // Garantir que a data está no formato ISO antes de converter para brasileiro
      let dataISO = agenda.data;
      if (agenda.data && agenda.data.includes('/')) {
        // Se vier em formato brasileiro, converte para ISO
        const [dia, mes, ano] = agenda.data.split('/');
        dataISO = `${ano}-${mes}-${dia}`;
      }
      // Agora converte para brasileiro para exibir
      let dataFormatada = dataISO;
      if (dataISO && dataISO.includes('-')) {
        const [ano, mes, dia] = dataISO.split('-');
        dataFormatada = `${dia}/${mes}/${ano}`;
      }
      
      lista[id] = {
        ...agenda,
        paciente,
        profissional,
        procedimento,
        data: dataFormatada
      };
    }
    res.status(200).json(lista);
  });

  // POST - criar novo agendamento com validações
  server.post(`/${entityName}`, (req, res) => {
    const data = req.body;

    // Validar campos obrigatórios
    const errorMsg = schemaCheck(data);
    if (errorMsg) {
      return res.status(400).json({ msg: errorMsg });
    }

    // Verificar se paciente, profissional e procedimento existem
    const paciente = db.get(`/pacientes/${data.idPaciente}`);
    const profissional = db.get(`/profissionais/${data.idProfissional}`);
    const procedimento = db.get(`/procedimentos/${data.idProcedimento}`);

    if (!paciente)
      return res.status(400).json({ msg: "Paciente não encontrado" });
    if (!profissional)
      return res.status(400).json({ msg: "Profissional não encontrado" });
    if (!procedimento)
      return res.status(400).json({ msg: "Procedimento não encontrado" });

    // Validar se profissional está vinculado ao procedimento
    if (
      !Array.isArray(procedimento.idProfissionais) ||
      !procedimento.idProfissionais.includes(data.idProfissional)
    ) {
      return res.status(400).json({
        msg: "Este profissional não está vinculado ao procedimento informado",
      });
    }

    // Validação e conversão de data (de dd/MM/yyyy para YYYY-MM-DD)
    const regexData = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (regexData.test(data.data)) {
      const [, dia, mes, ano] = data.data.match(regexData);
      data.data = `${ano}-${mes}-${dia}`; // Salva sempre em ISO
    } else if (data.data && data.data.includes('-')) {
      // Já está em ISO, mantém
    } else {
      return res.status(400).json({ msg: "Formato de data inválido. Use dd/MM/yyyy ou YYYY-MM-DD" });
    }

    // Validar formato do horário
    const regexHorario = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!regexHorario.test(data.horario)) {
      return res
        .status(400)
        .json({ msg: "Formato de horário inválido. Use HH:mm (24h)" });
    }

    // Validar se data/hora são futuras
    const dataHoraAgendamento = new Date(`${data.data}T${data.horario}:00`);
    const agora = new Date();
    if (dataHoraAgendamento <= agora) {
      return res
        .status(400)
        .json({ msg: "A data e horário do agendamento devem ser atuais" });
    }

    // Validar conflitos de horário com o mesmo profissional
    const agendas = db.get(`/${entityName}`);
    const intervaloMinutos = 20;

    for (let key in agendas) {
      const ag = agendas[key];
      if (ag.idProfissional === data.idProfissional && ag.data === data.data) {
        const agHora = new Date(`${ag.data}T${ag.horario}:00`);
        const diffMin = Math.abs((agHora - dataHoraAgendamento) / (1000 * 60));
        if (diffMin < intervaloMinutos) {
          return res.status(400).json({
            msg: `Conflito de horário: Já existe um agendamento às ${ag.horario} com este profissional. Aguarde pelo menos ${intervaloMinutos} minutos entre agendamentos.`,
            horarioConflitante: ag.horario,
            dataConflitante: ag.data,
          });
        }
      }
    }

    // Forçar status como 'pendente' no cadastro
    data.status = "pendente";

    //  Criar e salvar o agendamento com ID
    const id = db.newID("AGENDAMENTO-");
    data.id = id;
    db.set(`/${entityName}/${id}`, data);
    res.status(201).json({ msg: "Agendamento realizado com sucesso", id });
  });

  // PUT - atualizar agendamento
  server.put(`/${entityName}/:id`, (req, res) => {
    const id = req.params.id;
    const agendamentoExistente = db.get(`/${entityName}/${id}`);

    if (!agendamentoExistente) {
      return res.status(404).json({ msg: "Agendamento não encontrado" });
    }

    const data = req.body;

    // Validação de schema
    const errorMsg = schemaCheck(data);
    if (errorMsg) {
      return res.status(400).json({ msg: errorMsg });
    }

    // Verificação da existência dos dados relacionados

    const paciente = db.get(`/pacientes/${data.idPaciente}`);
    const profissional = db.get(`/profissionais/${data.idProfissional}`);
    const procedimento = db.get(`/procedimentos/${data.idProcedimento}`);

    if (!paciente)
      return res.status(400).json({ msg: `Paciente não encontrado: ${data.idPaciente}` });
    if (!profissional)
      return res.status(400).json({ msg: "Profissional não encontrado" });
    if (!procedimento)
      return res.status(400).json({ msg: "Procedimento não encontrado" });

    // Verificação de vínculo entre procedimento e profissional
    if (!procedimento.idProfissionais.includes(data.idProfissional)) {
      return res.status(400).json({
        msg: "Este profissional não está vinculado ao procedimento informado",
      });
    }

    // Validação e conversão de data (de dd/MM/yyyy para YYYY-MM-DD)
    const regexData = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (regexData.test(data.data)) {
      const [, dia, mes, ano] = data.data.match(regexData);
      data.data = `${ano}-${mes}-${dia}`; // Salva sempre em ISO
    } else if (data.data && data.data.includes('-')) {
      // Já está em ISO, mantém
    } else {
      return res.status(400).json({ msg: "Formato de data inválido. Use dd/MM/yyyy ou YYYY-MM-DD" });
    }

    // Validação do formato de horário
    const regexHorario = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!regexHorario.test(data.horario)) {
      return res
        .status(400)
        .json({ msg: "Formato de horário inválido. Use HH:mm (24h)" });
    }

    // Data/hora devem ser futuras
    const dataHoraAgendamento = new Date(`${data.data}T${data.horario}:00`);
    const agora = new Date();
    if (dataHoraAgendamento <= agora) {
      return res
        .status(400)
        .json({ msg: "A data e horário do agendamento devem ser atuais" });
    }

    // Verificar conflito de horário com o mesmo profissional (exceto o próprio agendamento)
    const agendas = db.get(`/${entityName}`);
    const intervaloMinutos = 20;

    for (let key in agendas) {
      if (key === id) continue;
      const ag = agendas[key];
      if (ag.idProfissional === data.idProfissional && ag.data === data.data) {
        const agHora = new Date(`${ag.data}T${ag.horario}:00`);
        const diffMin = Math.abs((agHora - dataHoraAgendamento) / (1000 * 60));
        if (diffMin < intervaloMinutos) {
          return res.status(400).json({
            msg: `Conflito de horário: já existe um agendamento às ${ag.horario} com este profissional. Aguarde pelo menos ${intervaloMinutos} minutos entre agendamentos.`,
            horarioConflitante: ag.horario,
            dataConflitante: ag.data,
          });
        }
      }
    }

    // Validar status, se vier no corpo da requisição
    const statusPermitidos = [
      "pendente",
      "confirmada",
      "concluída",
      "cancelada",
    ];
    if (data.status && !statusPermitidos.includes(data.status)) {
      return res.status(400).json({ msg: "Status inválido" });
    }

    // Atualizar agendamento
    db.set(`/${entityName}/${id}`, {
      ...data,
      id,
    });

    res.status(200).json({ msg: "Agendamento atualizado com sucesso" });
  });

  // DELETE - remover agendamento
  server.delete(`/${entityName}/:id`, (req, res) => {
    try {
      console.log('Iniciando processo de deletar agendamento:', req.params.id);
      const id = req.params.id;
      
      console.log('Buscando agendamentos no banco de dados');
      const agendamentos = db.get(`/${entityName}`) || {};
      console.log('Agendamentos encontrados:', agendamentos);

      if (!agendamentos[id]) {
        console.log('Agendamento não encontrado:', id);
        return res.status(404).json({ msg: "Agendamento não encontrado" });
      }

      console.log('Deletando agendamento:', id);
      const { [id]: agendamentoDeletado, ...agendamentosRestantes } = agendamentos;
      
      console.log('Salvando agendamentos atualizados');
      db.set(`/${entityName}`, agendamentosRestantes);
      
      console.log('Agendamento deletado com sucesso');
      res.status(200).json({ msg: "Agendamento excluído com sucesso" });
    } catch (error) {
      console.error('Erro ao deletar agendamento:', error);
      res.status(500).json({ 
        msg: "Erro ao deletar agendamento",
        error: error.message 
      });
    }
  });
}
