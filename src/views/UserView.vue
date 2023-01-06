<script>
import { defineComponent } from "vue";
import Modal from "../components/Modal.vue";

export default defineComponent({
  name: "UserView",
  components: {
    Modal,
  },
  data() {
    return {
      modalVisible: false,
      tableData: [
        {
          date: "2016-05-03",
          name: "Tom",
          address: "No. 189, Grove St, Los Angeles",
        },
        {
          date: "2016-05-02",
          name: "Tom",
          address: "No. 189, Grove St, Los Angeles",
        },
        {
          date: "2016-05-04",
          name: "Tom",
          address: "No. 189, Grove St, Los Angeles",
        },
        {
          date: "2016-05-01",
          name: "Tom",
          address: "No. 189, Grove St, Los Angeles",
        },
      ],
    };
  },
  methods: {
    handleClick(name) {
      console.log(name);
      this.modalVisible = true;
    },
    modalCancel(value) {
      this.modalVisible = value;
    },
    modalConfirm(value) {
      this.modalVisible = value;
    },
  },
});
</script>

<template>
  <el-table :data="tableData" stripe style="width: 100%">
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="address" label="Address" />
    <el-table-column fixed="right" label="Operations" width="120">
      <template #default="scope">
        <el-button
          link
          type="primary"
          size="small"
          @click="() => handleClick(scope.row.name)"
          >Detail</el-button
        >
        <el-button link type="primary" size="small">Edit</el-button>
      </template>
    </el-table-column>
  </el-table>
  <Modal
    v-model="modalVisible"
    title="Registrar usuario"
    :formData="{ name: 'prueba' }"
    @modalCancel="modalCancel"
    @modalConfirm="modalConfirm"
  >
    <template #body="formData">
      <el-form-item label="Name" label-width="120">
        <el-input v-model="formData.name" autocomplete="off" />
      </el-form-item>
    </template>
  </Modal>
</template>

<style>
</style>
