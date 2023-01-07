import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";

export const useUserStore = defineStore("user", () => {
  const loading = ref(false);
  const users = ref([]);

  const getUsers = async () => {
    const result = {
      error: 0,
      message: "",
      data: [],
    };
    try {
      loading.value = true;
      const response = await axios.get("users");
      const { data } = response;
      console.log(data);
    } catch (error) {
      const { response } = error;
      result.error = response.status;
      result.message = response.data.message;
    } finally {
      loading.value = false;
    }
    return result;
  };

  return { loading, users, getUsers };
});
