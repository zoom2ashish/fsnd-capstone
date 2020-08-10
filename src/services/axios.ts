import axios from 'axios';

const instance = axios.create({
  headers: {
    'Authrization': 'xxxxxx'
  }
});

instance.interceptors.response.use(
  response => response,
  error => {
    console.log(error);
      throw error;
  });

export default instance;