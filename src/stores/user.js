import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";

export const useUserStore = defineStore("user", function () {
  const loading = ref(false);

  const route = useRoute();

  const getUsers = async () => {
    const result = {
      error: 0,
      message: "",
      data: [],
    };
    try {
      const query = route.query;
      const params = new URLSearchParams(query).toString();
      loading.value = true;
      const response = await axios.get(`users?${params}`);
      const { data } = response;
      result.data = data;
    } catch (error) {
      const { response } = error;
      result.error = response.status;
      result.message = response.data.message;
    } finally {
      loading.value = false;
    }
    return result;
  };

  const getUser = async (id) => {
    const result = {
      error: 0,
      message: "",
      data: {},
    };
    try {
      loading.value = true;
      const response = await axios.get(`users/${id}`);
      const { data } = response;
      result.data = data.data;
    } catch (error) {
      const { response } = error;
      result.error = response.status;
      result.message = response.data.message;
    } finally {
      loading.value = false;
    }
    return result;
  };

  const postUser = async (user) => {
    const result = {
      error: 0,
      message: "",
      data: {},
    };
    try {
      loading.value = true;
      const response = await axios.post("users", user);
      const { data } = response;
      result.data = data.data;
    } catch (error) {
      const { response } = error;
      result.error = response.status;
      result.data = response.data;
    } finally {
      loading.value = false;
    }
    return result;
  };

  return { loading, getUsers, getUser, postUser };
});
