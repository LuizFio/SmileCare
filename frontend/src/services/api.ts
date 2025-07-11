const API_BASE_URL = 'http://localhost:3001';

// Função para fazer requisições
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = { 
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || `Erro: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
};

// === PACIENTES ===
export const pacientesAPI = {
  getAll: () => apiRequest('/pacientes'),
  getById: (id: string) => apiRequest(`/pacientes/${id}`),
  getByEmail: (email: string) => apiRequest(`/pacientes/email/${email}`),
  create: (pacienteData: any) => apiRequest('/pacientes', {
    method: 'POST',
    body: JSON.stringify(pacienteData),
  }),
  update: (id: string, pacienteData: any) => apiRequest(`/pacientes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(pacienteData),
  }),
  delete: (id: string) => apiRequest(`/pacientes/${id}`, {
    method: 'DELETE',
  }),
};

// === PROFISSIONAIS ===
export const profissionaisAPI = {
  getAll: () => apiRequest('/profissionais'),
  getById: (id: string) => apiRequest(`/profissionais/${id}`),
  getByEmail: (email: string) => apiRequest(`/profissionais/email/${email}`),
  create: (data: any) => apiRequest('/profissionais', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/profissionais/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/profissionais/${id}`, {
    method: 'DELETE',
  }),
};

// === PROCEDIMENTOS ===
export const procedimentosAPI = {
  getAll: () => apiRequest('/procedimentos'),
  getById: (id: string) => apiRequest(`/procedimentos/${id}`),
  create: (data: any) => apiRequest('/procedimentos', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/procedimentos/${id}`, {
    method: 'PUT',  
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/procedimentos/${id}`, {  
    method: 'DELETE',
  }),
};

// === AGENDAMENTOS ===
export const agendamentosAPI = {
    getAll: () => apiRequest('/agendamentos'),
    getById: (id: string) => apiRequest(`/agendamentos/${id}`), 
  create: (data: any) => apiRequest('/agendamentos', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/agendamentos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => {
    console.log('Chamando API para deletar agendamento:', id);
    return apiRequest(`/agendamentos/${id}`, {
      method: 'DELETE',
    }).then(response => {
      console.log('Resposta da API ao deletar:', response);
      return response;
    }).catch(error => {
      console.error('Erro na chamada da API ao deletar:', error);
      throw error;
    });
  },
};

// === AUTENTICAÇÃO ===
export const authAPI = {
  loginPaciente: (email: string, senha: string) =>
    apiRequest('/auth/paciente', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    }),

  loginProfissional: (email: string, cro: string, senha: string) =>
    apiRequest('/auth/profissional', {
      method: 'POST',
      body: JSON.stringify({ email, cro, senha }),
    }),
};