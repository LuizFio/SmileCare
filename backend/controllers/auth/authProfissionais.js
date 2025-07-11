import jwt from "jsonwebtoken";
import { SimpleCrypto } from "simple-crypto-js";
import * as dotenv from "dotenv";
dotenv.config();

const SECRET = process.env.SECRET;
const isAUTH = process.env.AUTH;

if (isAUTH) {
  console.log(`🔥 server using AUTH para profissionais!`);
}

function getToken(email) {
  let token = jwt.sign({ email }, SECRET, { expiresIn: 120 });
  return token;
}

export default function auth(server, db) {
  // LOGIN
  server.post("/auth/profissional", (req, res) => {
    const { email, cro, senha } = req.body || {};

    // Verifica campos obrigatórios
    if (!email && !cro && !senha) {
      return res
        .status(400)
        .json({ error: true, msg: "Faltando e-mail, CRO e senha" });
    }
    if (!email) {
      return res.status(400).json({ error: true, msg: "Faltando e-mail" });
    }
    if (!cro) {
      return res.status(400).json({ error: true, msg: "Faltando CRO" });
    }
    if (!senha) {
      return res.status(400).json({ error: true, msg: "Faltando senha" });
    }

    const profissionais = db.get("/profissionais");
    const simpleCrypto = new SimpleCrypto(SECRET);

    for (let key in profissionais) {
      const profissional = profissionais[key];

      if (profissional.email === email && profissional.cro === cro) {
        try {
          const decrypted = simpleCrypto.decrypt(profissional.senha);
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

    return res.status(400).json({ error: true, msg: "Profissional com este E-mail e CRO não cadastrado" });
  });
}

