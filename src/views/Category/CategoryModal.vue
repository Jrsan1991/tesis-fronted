<script>
import { defineComponent } from "vue";
import { ElMessage } from "element-plus";
import { useCategoryStore } from "@/stores/category";
import { getError } from "@/utils/helpers";

export default defineComponent({
  name: "CategoryModal",
  props: {
    id: Number,
    readOnly: Boolean,
    screen: Object,
  },
  setup() {
    const store = useCategoryStore();
    return {
      store,
    };
  },
  data() {
    return {
      loading: false,
      modalVisible: true,
      formData: {},
    };
  },
  computed: {
    rules() {
      return {
        name: [
          {
            required: true,
            message: "Por favor ingresa el nombre",
            trigger: "blur",
          },
        ],
      };
    },
  },
  mounted() {
    if (this.id) {
      this.getData();
    }
  },
  methods: {
    async getData() {
      this.loading = true;
      const result = await this.store.getCategory(this.id);
      if (result.error === 0) {
        const { created_at, updated_at, email_verified_at, ...data } =
          result.data;
        this.formData = data;
      }
      this.loading = false;
    },
    handleClose() {
      this.$emit("modalCancel");
    },
    handleConfirm() {
      this.$refs["categoryForm"].validate(async (valid) => {
        if (valid) {
          this.loading = true;
          const result = await this.store.postCategory({ ...this.formData });
          if (result.error > 0) {
            ElMessage({
              type: "error",
              message: getError(result.data),
            });
          } else {
            ElMessage({
              type: "success",
              message: "Guardado con éxito",
            });
            this.$emit("modalConfirm");
          }
          this.loading = false;
        } else {
          return false;
        }
      });
    },
  },
});
</script>

<template>
  <el-dialog
    :title="
      readOnly ? 'Categoria' : `${id > 0 ? 'Editar' : 'Registrar'} categoria`
    "
    v-model="modalVisible"
    :before-close="handleClose"
    :width="screen.dialogWidth"
  >
    <el-form
      ref="categoryForm"
      v-loading="loading"
      :model="formData"
      status-icon
      :rules="rules"
      label-width="120"
      :label-position="screen.labelPosition"
    >
      <el-form-item label="Nombre" prop="name">
        <el-input
          v-model="formData.name"
          autocomplete="off"
          :disabled="readOnly || loading"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose" :disabled="loading">{{
          readOnly ? "Cerrar" : "Cancelar"
        }}</el-button>
        <el-button
          type="primary"
          @click="handleConfirm"
          :loading="loading"
          v-if="!readOnly"
        >
          Guardar
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped></style>
