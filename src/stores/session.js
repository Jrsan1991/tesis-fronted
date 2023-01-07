import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useStorage } from "@vueuse/core";
import axios from "axios";

export const useSessionStore = defineStore("session", () => {
  const loading = ref(false);
  const token = ref(useStorage("token", ""));
  const user = ref(useStorage("user", {}));

  const login = async (credentials) => {
    const result = {
      error: 0,
      message: "",
    };
    try {
      loading.value = true;
      const response = await axios.post("login", credentials);
      const { data } = response;
      token.value = data.token;
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

  const logout = async () => {
    let result = true;
    try {
      loading.value = true;
      token.value = "";
      user.value = {};
    } catch (error) {
      result = false;
    } finally {
      loading.value = false;
    }
    return result;
  };

  return { loading, token, user, login, logout };
});
