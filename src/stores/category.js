import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";

export const useCategoryStore = defineStore("category", function () {
  const loading = ref(false);

  const route = useRoute();

  const getCategories = async () => {
    const result = {
      error: 0,
      message: "",
      data: [],
    };
    try {
      const query = route.query;
      const params = new URLSearchParams(query).toString();
      loading.value = true;
      const response = await axios.get(`category?${params}`);
      const { data } = response;
      result.data = data;
    } catch (error) {
      const { response } = error;
      result.error = response.status;
      result.data = response.data;
    } finally {
      loading.value = false;
    }
    return result;
  };

  const getCategory = async (id) => {
    const result = {
      error: 0,
      message: "",
      data: {},
    };
    try {
      loading.value = true;
      const response = await axios.get(`category/${id}`);
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

  const postCategory = async (category) => {
    const result = {
      error: 0,
      message: "",
      data: {},
    };
    try {
      loading.value = true;
      const response = await axios.post("category", category);
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

  return { loading, getCategories, getCategory, postCategory };
});
