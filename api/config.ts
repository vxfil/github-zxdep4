import axios from "axios";

const apiClient = axios.create({
  baseURL: 'https://api.open-meteo.com/'
});

const { get, post, put, delete: destroy } = apiClient;
export { get, post, put, destroy };