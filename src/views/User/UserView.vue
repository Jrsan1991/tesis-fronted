<script>
import { defineComponent } from "vue";
import { useUserStore } from "@/stores/user";
import UserModal from "./UserModal.vue";
import Search from "@/components/Search.vue";
import Pager from "@/components/Pager.vue";

export default defineComponent({
  name: "UserView",
  components: {
    UserModal,
    Search,
    Pager,
  },
  setup() {
    const user = useUserStore();
    return {
      user,
    };
  },
  data() {
    return {
      modalVisible: false,
      readOnly: false,
      users: [],
      row: {},
      pageSize: 10,
      total: 10,
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      const result = await this.user.getUsers();
      if (result.error === 0) {
        const { data, meta } = result.data;
        this.users = data;
        this.pageSize = meta.per_page;
        this.total = meta.total;
      }
    },
    handleClick(row, readOnly) {
      this.row = row;
      this.readOnly = readOnly;
      this.modalVisible = true;
    },
    modalCancel(value) {
      this.modalVisible = value;
    },
    modalConfirm(value) {
      this.getData();
      this.modalVisible = value;
    },
    async searchUsers() {
      const result = await this.user.getUsers();
      if (result.error === 0) {
        this.users = result.data;
      }
    },
  },
});
</script>

<template>
  <el-row>
    <el-col class="align-right">
      <el-button type="success" @click="handleClick({}, false)">
        Nuevo
      </el-button>
    </el-col>
  </el-row>
  <Search @search="searchUsers" />
  <el-table :data="users" stripe style="width: 100%">
    <el-table-column prop="name" label="Nombre" />
    <el-table-column prop="credential" label="Cédula" />
    <el-table-column prop="email" label="Correo" />
    <el-table-column prop="grade" label="Grado" />
    <el-table-column prop="is_visit" label="Es visitante">
      <template #default="scope">
        {{ scope.row.is_visit ? "Si" : "No" }}
      </template>
    </el-table-column>
    <el-table-column prop="visit_unity" label="Unidad" />
    <el-table-column fixed="right" label="Acciones" width="120">
      <template #default="scope">
        <el-button
          link
          type="primary"
          size="small"
          @click="() => handleClick(scope.row, true)"
          >Ver</el-button
        >
        <el-button
          link
          type="primary"
          size="small"
          @click="() => handleClick(scope.row, false)"
          >Editar</el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <Pager :pageSize="pageSize" :total="total" @search="searchUsers" />
  <UserModal
    v-if="modalVisible"
    :id="row.id"
    :readOnly="readOnly"
    @modalCancel="modalCancel"
    @modalConfirm="modalConfirm"
  />
  <!-- <Modal
    v-model="modalVisible"
    title="Registrar usuario"
    :formData="formData"
    @modalCancel="modalCancel"
    @modalConfirm="modalConfirm"
  >
    <template #body="formData">
      <el-form-item label="Nombre" label-width="120">
        <el-input v-model="formData.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Cédula" label-width="120">
        <el-input v-model="formData.credential" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Correo" label-width="120">
        <el-input v-model="formData.email" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Grado" label-width="120">
        <el-input v-model="formData.grade" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Es visitante" label-width="120">
        <el-switch v-model="formData.is_visit" />
      </el-form-item>
    </template>
  </Modal> -->
</template>

<style scoped>
.align-right {
  margin-bottom: 1rem;
  display: flex;
  justify-content: right;
  align-items: right;
}
</style>
