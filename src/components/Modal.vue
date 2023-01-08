<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Modal",
  props: {
    title: String,
    formData: Object,
  },
});
</script>

<template>
  <el-dialog :title="title">
    <el-form :model="formData">
      <slot name="body" v-bind="formData"></slot>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('modalCancel')">Cancelar</el-button>
        <el-button type="primary" @click="$emit('modalConfirm')">
          Guardar
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped></style>
