<script>
import { ref, defineComponent } from "vue";

export default defineComponent({
  name: "Navbar",
  data() {
    return {
      activeIndex: "0",
    };
  },
  methods: {
    handleSelect(key, keyPath) {},
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
      <template #title>Roberto Ruiz</template>
      <el-menu-item index="profile">Perfil</el-menu-item>
      <el-menu-item index="logout">Salir</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<style>
.flex-grow {
  flex-grow: 1;
}
</style>
