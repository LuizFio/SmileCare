import jwt from "jsonwebtoken";
import { SimpleCrypto } from "simple-crypto-js";
import * as dotenv from "dotenv";
dotenv.config();

const SECRET = process.env.SECRET;
const isAUTH = process.env.AUTH;

if (isAUTH) {
  console.log(`🔥 server using AUTH para pacientes!`);
}

function getToken(email) {
  let token = jwt.sign({ email }, SECRET, { expiresIn: 120 });
  return token;
}

export default function auth(server, db) {
  // LOGIN
  server.post("/auth/paciente", (req, res) => {
    const { email, senha } = req.body || {};

    // Verificação de campos
    if (!email && !senha)
      return res
        .status(400)
        .json({ error: true, msg: "Faltando e-mail e senha" });
    if (!email)
      return res.status(400).json({ error: true, msg: "Faltando e-mail" });
    if (!senha)
      return res.status(400).json({ error: true, msg: "Faltando senha" });

    const pacientes = db.get("/pacientes");
    const simpleCrypto = new SimpleCrypto(SECRET);

    for (let key in pacientes) {
      const paciente = pacientes[key];

      if (paciente.email === email) {
        try {
          const decrypted = simpleCrypto.decrypt(paciente.senha);
          // Comparação mais segura
          if (String(decrypted).trim() === String(senha).trim()) {
            const token = getToken(email);
            return res
              .status(200)
              .json({ msg: "Token gerado com sucesso", token });
          } else {
            return res
              .status(400)
              .json({ error: true, msg: "Senha incorreta" });
          }
        } catch (err) {
          return res
            .status(400)
            .json({ error: true, msg: "Erro ao descriptografar senha" });
        }
      }
    }

    return res.status(400).json({ error: true, msg: "Paciente com este E-mail não cadastrado" });
  });
}
