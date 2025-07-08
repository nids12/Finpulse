import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api", // adjust if your backend runs elsewhere
});

export default instance;
