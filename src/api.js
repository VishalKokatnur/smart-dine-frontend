import axios from "axios";

const api = axios.create({
  baseURL: "https://smartdinepro-backend-vishal.onrender.com/api/",
});

export default api;