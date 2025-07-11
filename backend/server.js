import { server, db, PORT } from "./initServer.js"
import pacientesController from "./controllers/pacientesController.js"
import profissionaisController from "./controllers/profissionaisController.js"
import procedimentosController from "./controllers/procedimentosController.js"
import agendamentosController from "./controllers/agendamentosController.js"
import authPacientes from './controllers/auth/authPacientes.js'
import authProfissionais from './controllers/auth/authProfissionais.js'


server.get('/', (req, res) => {
    res.send('🙋‍♂️ Hello...route /');
});

pacientesController(server,db)
profissionaisController(server,db)
procedimentosController(server,db)
agendamentosController(server,db)
authPacientes(server,db)
authProfissionais(server,db)

server.listen(PORT, () => {
    console.log('Server is running on port '+PORT);
});