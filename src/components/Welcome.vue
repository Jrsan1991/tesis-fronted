<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Welcome",
});
</script>

<template>
  <div class="container">
    <img class="logo" src="@/assets/logo.png" />

    <h1>¡Bienvenid@!</h1>
    <p>Sistema para el control de inventario</p>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 30vh;
  animation: blink 3s linear infinite;
}

@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
