import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";

export const useAssignmentStore = defineStore("assignment", function () {
  const loading = ref(false);

  const route = useRoute();

  const getAssignments = async () => {
    const result = {
      error: 0,
      message: "",
      data: [],
    };
    try {
      const query = route.query;
      const params = new URLSearchParams(query).toString();
      loading.value = true;
      const response = await axios.get(`assignment?${params}`);
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

  const getAssignment = async (id) => {
    const result = {
      error: 0,
      message: "",
      data: {},
    };
    try {
      loading.value = true;
      const response = await axios.get(`assignment/${id}`);
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

  const postAssignment = async (assignment) => {
    const result = {
      error: 0,
      message: "",
      data: {},
    };
    try {
      loading.value = true;
      const response = await axios.post("assignment", assignment);
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

  return { loading, getAssignments, getAssignment, postAssignment };
});
