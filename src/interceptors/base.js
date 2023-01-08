import axios from "axios";
const { VITE_API_URL } = import.meta.env;
import { useSessionStore } from "@/stores/session";

axios.interceptors.request.use((request) => {
  const session = useSessionStore();
  request.baseURL = VITE_API_URL;
  request.headers.Authorization = `Bearer ${session.token}`;
  return request;
});
