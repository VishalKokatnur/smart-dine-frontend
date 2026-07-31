import axios from "axios";

const api = axios.create({
  baseURL: "https://YOUR-BACKEND.onrender.com/api/",
});

export default api;