import axios from 'axios'
import { LOGIN_USER, REGISTER_USER, AUTH_USER } from './types';

export function loginUser(dataToSubmit) {

  // 서버를 호출 후 결과를 request에 대입
  const request = axios.post('/api/users/login', dataToSubmit)
  .then(response => response.data);

  // action -> reducer
  // action은 type과 response를 
  return {
    type: LOGIN_USER,
    payload: request
  }
}

export function registerUser(dataToSubmit) {
  const request = axios.post('/api/users/register', dataToSubmit)
  .then(response => response.data);

  return {
    type: REGISTER_USER,
    payload: request
  }
}

// get method라서 body는 필요없다 (dataToSubmit)
export function auth() {
  const request = axios.get('/api/users/auth')
  .then(response => response.data);

  return {
    type: AUTH_USER,
    payload: request
  }
}