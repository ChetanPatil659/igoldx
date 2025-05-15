// Client.js
import axios from "axios";

// Create an instance of Axios with default configurations
export const URL =
  "https://owl-amused-gratefully.ngrok-free.app/api/v1";
// export const URL = 'http://192.168.31.23:3001/api'

const Client = axios.create({
  baseURL: URL, // Base URL for your API
  headers: {
    "Content-Type": "application/json",
  },
});

export default Client;
