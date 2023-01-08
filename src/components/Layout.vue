<script>
import { defineComponent } from "vue";
import Navbar from "./Navbar.vue";

export default defineComponent({
  name: "Layout",
  components: {
    Navbar,
  },
});
</script>

<template>
  <el-container class="full-height">
    <el-header>
      <Navbar />
    </el-header>
    <el-main>
      <RouterView />
    </el-main>
  </el-container>
</template>

<style scoped>
</style>
