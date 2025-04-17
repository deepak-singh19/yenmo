import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API calls
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  register: (name: string, email: string, password: string, pan: string) => 
    api.post('/auth/register', { name, email, password, pan }),
  
  getMe: () => 
    api.get('/auth/me')
};

// MF Holdings API calls
export const mfAPI = {
  getHoldings: (pan: string) => 
    api.get('/mf/holdings', { params: { pan } })
};

// Loan API calls
export const loanAPI = {
  checkEligibility: (pan: string) => 
    api.post('/loans/check', { pan }),
  
  getHistory: (pan: string) => 
    api.get('/loans/history', { params: { pan } })
}; 