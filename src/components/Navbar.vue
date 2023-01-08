<script>
import { defineComponent } from "vue";
import { ElNotification } from "element-plus";

import { useSessionStore } from "@/stores/session";
import Dialog from "@/components/Dialog.vue";

export default defineComponent({
  name: "Navbar",
  components: {
    Dialog,
  },
  setup() {
    const session = useSessionStore();
    return {
      session,
    };
  },
  data() {
    return {
      activeIndex: "0",
      dialogVisible: false,
    };
  },
  methods: {
    handleSelect(key, keyPath) {},
    handleLogout() {
      this.dialogVisible = true;
    },
    dialogCancel(value) {
      this.dialogVisible = value;
    },
    async dialogConfirm(value) {
      this.dialogVisible = value;
      const result = await this.session.logout();
      if (result) {
        ElNotification({
          title: "Success",
          message: `Sesión cerrada con éxito`,
          type: "success",
        });
        this.$router.push("/login");
      } else {
        ElNotification({
          title: "Error",
          message: "Error al intentar cerrar la sesión",
          type: "error",
        });
      }
    },
  },
});
</script>

<template>
  <el-menu
    :default-active="activeIndex"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
    background-color="none"
    :router="true"
  >
    <el-menu-item index="/">LOGO</el-menu-item>
    <div class="flex-grow" />

    <el-sub-menu index="1">
      <template #title>Usuarios</template>
      <el-menu-item index="/users">Usuarios</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="2">
      <template #title>Productos</template>
      <el-menu-item index="/products">Productos</el-menu-item>
      <el-menu-item index="/categories">Categorias</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="3">
      <template #title>Asignaciones</template>
      <el-menu-item index="/assignments">Asignaciones</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="4">
      <template #title>{{ session.user.name }}</template>
      <el-menu-item index="profile">Perfil</el-menu-item>
      <el-menu-item index="" @click="handleLogout">Salir</el-menu-item>
    </el-sub-menu>
  </el-menu>

  <Dialog
    v-model="dialogVisible"
    title="Confirmar"
    message="¿Desea cerrar su sesión?"
    @dialogCancel="dialogCancel"
    @dialogConfirm="dialogConfirm"
  />
</template>

<style scoped>
.flex-grow {
  flex-grow: 1;
}
</style>
