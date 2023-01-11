import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";

export const useProductStore = defineStore("product", function () {
  const loading = ref(false);

  const route = useRoute();

  const getProducts = async () => {
    const result = {
      error: 0,
      message: "",
      data: [],
    };
    try {
      const query = route.query;
      const params = new URLSearchParams(query).toString();
      loading.value = true;
      const response = await axios.get(`product?${params}`);
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

  const findProducts = async (query) => {
    const result = {
      error: 0,
      message: "",
      data: [],
    };
    try {
      const params = new URLSearchParams(query).toString();
      loading.value = true;
      const response = await axios.get(`product?${params}`);
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

  const getProduct = async (id) => {
    const result = {
      error: 0,
      message: "",
      data: {},
    };
    try {
      loading.value = true;
      const response = await axios.get(`product/${id}`);
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

  const postProduct = async (product) => {
    const result = {
      error: 0,
      message: "",
      data: {},
    };
    try {
      loading.value = true;
      const response = await axios.post("product", product);
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

  return { loading, getProducts, findProducts, getProduct, postProduct };
});
