import axios from 'axios';

export const baseURL = process.env.REACT_APP_BACKEND_URL;

const chatApi = axios.create({
  baseURL: baseURL,
});

export default chatApi;