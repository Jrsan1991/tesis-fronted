<script>
import { defineComponent } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import resize from "@/components/resize";

import { useSessionStore } from "@/stores/session";

export default defineComponent({
  name: "Navbar",
  setup() {
    const store = useSessionStore();
    return {
      store,
    };
  },
  mixins: [resize],
  data() {
    return {
      activeIndex: "0",
    };
  },
  computed: {
    isAdmin() {
      return this.store.user.role === "admin";
    },
  },
  created() {
    this.activeIndex = this.$route.path;
  },
  methods: {
    handleSelect(key, keyPath) {},
    async handleLogout() {
      try {
        await ElMessageBox.confirm("¿Desea cerrar su sesión?", "Confirmar", {
          confirmButtonText: "Aceptar",
          cancelButtonText: "Cancelar",
          type: "warning",
        });
        const result = await this.store.logout();
        if (result) {
          ElMessage({
            type: "success",
            message: "Sesión cerrada con éxito",
          });
          this.$router.push("/login");
        } else {
          ElMessage({
            type: "error",
            message: "Error al intentar cerrar la sesión",
          });
        }
      } catch (error) {}
    },
  },
});
</script>

<template>
  <el-menu
    :default-active="activeIndex"
    mode="horizontal"
    :ellipsis="screen.mobile"
    @select="handleSelect"
    background-color="none"
    :router="true"
  >
    <el-menu-item index="/">
      <img class="logo_navbar" src="@/assets/logo.png" />
    </el-menu-item>

    <div class="flex-grow" />

    <el-sub-menu index="1" v-if="isAdmin">
      <template #title>Usuarios</template>
      <el-menu-item index="/users">Usuarios</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="2" v-if="isAdmin">
      <template #title>Productos</template>
      <el-menu-item index="/products">Productos</el-menu-item>
      <el-menu-item index="/categories">Categorias</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="3">
      <template #title>Asignaciones</template>
      <el-menu-item index="/assignments">Asignaciones</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="4">
      <template #title>{{ store.user.name }}</template>
      <el-menu-item index="profile">Perfil</el-menu-item>
      <el-menu-item index="" @click="handleLogout">Salir</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<style scoped>
.flex-grow {
  flex-grow: 1;
}

.logo_navbar {
  width: auto;
  height: 50px;
}
</style>
