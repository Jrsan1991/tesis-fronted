<script lang="js">
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
    <el-main class="bg">
      <RouterView />
    </el-main>
  </el-container>
</template>

<style>
.bg {
  background-color: floralwhite;
}
</style>
