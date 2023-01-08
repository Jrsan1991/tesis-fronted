<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Dialog",
  props: {
    title: String,
    message: String,
  },
});
</script>

<template>
  <el-dialog :title="title">
    <span>{{ message }}</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('dialogCancel')">Cancelar</el-button>
        <el-button type="primary" @click="$emit('dialogConfirm')">
          Aceptar
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped></style>
