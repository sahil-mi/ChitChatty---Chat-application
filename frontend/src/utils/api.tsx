// import axios from "axios";

// // Create an Axios instance
// const api = axios.create({
//   baseURL: "http://localhost:8000", // Your Django API base URL
//   headers: {
//     Authorization: `Token ${'0a69f93ff26b9debb49354b8cae4de70c93ef3a5'}`, // Replace with your actual token
//   },
// });

// export default api;

// 931014b340476542980068253ca3751e739ef121

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // Your Django API base URL
});

// Add a request interceptor to dynamically set the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Replace with the actual token retrieval logic
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
