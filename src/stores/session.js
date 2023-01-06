import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useStorage } from "@vueuse/core";
import axios from "axios";

const { VITE_API_URL } = import.meta.env;

export const useSessionStore = defineStore("session", () => {
  const loading = ref(false);
  const accessToken = ref(useStorage("accessToken", ""));
  const user = ref(useStorage("user", {}));

  const login = async (credentials) => {
    const result = {
      error: 0,
      message: "",
    };
    try {
      loading.value = true;
      const response = await axios.post(`${VITE_API_URL}/login`, credentials);
      const { data } = response;
      accessToken.value = data.token;
      user.value = data.user;
    } catch (error) {
      const { response } = error;
      result.error = response.status;
      result.message = response.data.message;
    } finally {
      loading.value = false;
    }
    return result;
  };

  return { loading, accessToken, user, login };
});
