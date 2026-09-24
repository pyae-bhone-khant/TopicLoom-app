
import axios from 'axios';

   const axiosInstance = axios.create({
  baseURL:  process.env.NEXT_BASE_API_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  return config;
});

export default axiosInstance;