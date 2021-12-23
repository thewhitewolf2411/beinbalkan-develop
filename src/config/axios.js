import axios from 'axios';

// Global Axios Config
//baseURL: 'https://api.coronapass.digital/v2/',
//baseURL: 'https://api.care1.devla.dev/v1/',

//
//vsapi.php?action=objects
export const axiosInstance = axios.create({
  baseURL: 'https://bib.rutmap.com/appsync/',
  headers: {name: 'Content-Type', value: 'application/json'},
});

// Axios Request Interceptor
export const AxiosInterceptors = {
  responseInterceptor() {
    axiosInstance.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        if (error.response.status === 401) {
          // navigate to login screen here
        }
        return Promise.reject(error);
      },
    );
  },
};
