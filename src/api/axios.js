import axios from 'axios'
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const API_LOCAL = "http://localhost:3000/api/"

const instance = axios.create({
    baseURL: API_LOCAL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
})

instance.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.status === 401) {
        if (error.response.data.message.includes("Token")) {
            Cookies.remove('token');
            useRouter.push('/login');
        }
      }
      return Promise.reject(error);
    }
);
  

export default instance;
