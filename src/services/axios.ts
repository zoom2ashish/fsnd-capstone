import axios from 'axios';

const instance = axios.create({
  headers: {
    'Authrization': 'xxxxxx'
  }
});

instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
    }
  });

export default instance;