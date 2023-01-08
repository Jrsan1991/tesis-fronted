<script>
import { defineComponent } from "vue";
import { useUserStore } from "@/stores/user";
import UserModal from "./UserModal.vue";
import Search from "@/components/Search.vue";
import Pager from "@/components/Pager.vue";
import resize from "@/components/resize";

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
  mixins: [resize],
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
        const { data, meta } = result.data;
        this.users = data;
        this.pageSize = meta.per_page;
        this.total = meta.total;
      }
    },
  },
});
</script>

<template>
  <el-row>
    <el-col class="align-right">
      <el-button type="success" @click="handleClick({}, false)" :disabled="user.loading">
        <font-awesome-icon class="button_icon" icon="fa-solid fa-plus" /> Nuevo
      </el-button>
    </el-col>
  </el-row>
  <Search @search="searchUsers" />
  <el-card v-loading="user.loading">
    <div class="flex" v-if="screen.mobile">
      <el-card
        v-for="user in users"
        :key="'user'+user.id"
        shadow="always"
        class="mobile_card"
      >
        <template #header>
          <div class="card-header">
            <span class="data">{{ user.name }}</span>
            <div>
              <el-button
                link
                class="button"
                type="primary"
                size="small"
                @click="() => handleClick(user, true)"
                :disabled="user.loading"
              >
                <font-awesome-icon class="button_icon" icon="fa-solid fa-eye" />
              </el-button>
              <el-button
                link
                class="button"
                type="primary"
                size="small"
                @click="() => handleClick(user, false)"
                :disabled="user.loading"
              >
                <font-awesome-icon class="button_icon" icon="fa-solid fa-edit" />
              </el-button>
            </div>
          </div>
        </template>
        <div class="card-header">
          <p class="label">Credencial:</p>
          <p class="data">{{ user.credential }}</p>
        </div>
        <div class="card-header">
          <p class="label">Correo:</p>
          <p class="data">{{ user.email }}</p>
        </div>
        <div class="card-header">
          <p class="label">Grado:</p>
          <p class="data">{{ user.grade }}</p>
        </div>
        <div class="card-header">
          <p class="label">Visitante:</p>
          <p class="data">{{ user.is_visit ? "Si" : "No" }}</p>
        </div>
      </el-card>
    </div>
    <el-table v-if="!screen.mobile" :data="users" stripe width="100%">
      <el-table-column prop="name" label="Nombre" min-width="150"/>
      <el-table-column prop="credential" label="Cédula" min-width="100" />
      <el-table-column prop="email" label="Correo" min-width="150" />
      <el-table-column prop="grade" label="Grado" min-width="100"/>
      <el-table-column prop="is_visit" label="Es visitante">
        <template #default="scope">
          {{ scope.row.is_visit ? "Si" : "No" }}
        </template>
      </el-table-column>
      <el-table-column prop="visit_unity" label="Unidad" />
      <el-table-column fixed="right" label="Acciones" width="100">
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="small"
            @click="() => handleClick(scope.row, true)"
            :disabled="user.loading"
          >
            <font-awesome-icon class="button_icon" icon="fa-solid fa-eye" />
          </el-button>
          <el-button
            link
            type="primary"
            size="small"
            @click="() => handleClick(scope.row, false)"
            :disabled="user.loading"
          >
            <font-awesome-icon class="button_icon" icon="fa-solid fa-edit" />
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pager :pageSize="pageSize" :total="total" @search="searchUsers" />
  </el-card>  
  <UserModal
    v-if="modalVisible"
    :id="row.id"
    :readOnly="readOnly"
    :screen="this.screen"
    @modalCancel="modalCancel"
    @modalConfirm="modalConfirm"
  />
</template>

<style scoped>
.align-right {
  margin-bottom: 1rem;
  display: flex;
  justify-content: right;
  align-items: right;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mobile_card{
  margin: 5px 0 5px 0;
}
.label {
  
}
.data {
  font-weight: bold;
}
</style>
