<script>
import { defineComponent } from "vue";
import Welcome from "@/components/Welcome.vue";

export default defineComponent({
  name: "HomeView",
  components: { Welcome },
});
</script>

<template>
  <Welcome />
</template>

<style scoped></style>
