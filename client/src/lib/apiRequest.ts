import axios, { AxiosInstance } from "axios";

const apiRequest: AxiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
});

export default apiRequest;
