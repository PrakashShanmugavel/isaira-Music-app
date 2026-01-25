import axios from "axios";

const api = axios.create({
  baseURL: "https://isaira-music-app.onrender.com/api",
});

export default api;
