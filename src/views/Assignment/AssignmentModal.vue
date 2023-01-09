<script>
import { defineComponent } from "vue";
import { ElNotification } from "element-plus";
import { useProductStore } from "@/stores/product";
import { useCategoryStore } from "@/stores/category";
import { getError } from "@/utils/helpers";

export default defineComponent({
  name: "ProductModal",
  props: {
    id: Number,
    readOnly: Boolean,
    screen: Object,
  },
  setup() {
    const store = useProductStore();
    const storeCategory = useCategoryStore();
    return {
      store,
      storeCategory,
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
        serial: [
          {
            required: true,
            message: "Por favor ingresa la serie",
            trigger: "blur",
          },
        ],
        name: [
          {
            required: true,
            message: "Por favor ingresa el nombre",
            trigger: "blur",
          },
        ],
        type: [
          {
            required: true,
            message: "Por favor ingresa el tipo",
            trigger: "blur",
          },
        ],
        brand: [
          {
            required: false,
            message: "Por favor ingresa la marca",
            trigger: "blur",
          },
        ],
        state: [
          {
            required: true,
            message: "Por favor ingresa el estado",
            trigger: "blur",
          },
        ],
        quantity: [
          {
            required: true,
            message: "Por favor ingresa la cantidad",
            trigger: "blur",
          },
        ],
        detail: [
          {
            required: false,
            message: "Por favor ingresa el detalle",
            trigger: "blur",
          },
        ],
        category_id: [
          {
            required: true,
            message: "Por favor ingresa la categoria",
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
      const result = await this.store.getProduct(this.id);
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
      this.$refs["productForm"].validate(async (valid) => {
        if (valid) {
          this.loading = true;
          const result = await this.store.postProduct({ ...this.formData });
          if (result.error > 0) {
            ElNotification({
              title: "Error",
              message: getError(result.data),
              type: "error",
            });
          } else {
            ElNotification({
              title: "Success",
              message: "Guardado con éxito",
              type: "success",
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
      readOnly ? 'Producto' : `${id > 0 ? 'Editar' : 'Registrar'} producto`
    "
    v-model="modalVisible"
    :before-close="handleClose"
    :width="screen.dialogWidth"
  >
    <el-form
      ref="productForm"
      v-loading="loading"
      :model="formData"
      status-icon
      :rules="rules"
      label-width="120"
      :label-position="screen.labelPosition"
    >
      <el-form-item label="Serie" prop="serial">
        <el-input
          v-model="formData.serial"
          autocomplete="off"
          :disabled="readOnly || loading"
        />
      </el-form-item>
      <el-form-item label="Nombre" prop="name">
        <el-input
          v-model="formData.name"
          autocomplete="off"
          :disabled="readOnly || loading"
        />
      </el-form-item>
      <el-form-item label="Tipo" prop="type">
        <el-input
          v-model="formData.type"
          autocomplete="off"
          :disabled="readOnly || loading"
        />
      </el-form-item>
      <el-form-item label="Marca" prop="brand">
        <el-input
          v-model="formData.brand"
          autocomplete="off"
          :disabled="readOnly || loading"
        />
      </el-form-item>
      <el-form-item label="Estado" prop="state">
        <el-input
          v-model="formData.state"
          autocomplete="off"
          :disabled="readOnly || loading"
        />
      </el-form-item>
      <el-form-item label="Cantidad" prop="quantity">
        <el-input
          type="number"
          v-model="formData.quantity"
          autocomplete="off"
          :disabled="readOnly || loading"
        />
      </el-form-item>
      <el-form-item label="Detalle" prop="detail">
        <el-input
          type="textarea"
          v-model="formData.detail"
          autocomplete="off"
          :disabled="readOnly || loading"
        />
      </el-form-item>
      <el-form-item label="Categoria" prop="category_id">
        <el-select
          v-model="formData.category_id"
          placeholder="Seleccione"
          :disabled="readOnly || loading"
        >
          <el-option
            v-for="(category, key) in storeCategory.categoryList"
            :key="`category-${key}`"
            :label="category.label"
            :value="category.value"
          />
        </el-select>
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
