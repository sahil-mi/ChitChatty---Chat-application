import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://localhost:8000", // Your Django API base URL
  headers: {
    Authorization: `Token ${'0a69f93ff26b9debb49354b8cae4de70c93ef3a5'}`, // Replace with your actual token
  },
});

export default api;
