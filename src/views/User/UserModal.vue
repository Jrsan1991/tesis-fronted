<script>
import { defineComponent } from "vue";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/user";
import { getError } from "@/utils/helpers";
import grades from "@/data/grades";

export default defineComponent({
  name: "UserModal",
  props: {
    id: Number,
    readOnly: Boolean,
    screen: Object,
  },
  setup() {
    const store = useUserStore();
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
        password: [
          {
            required:
              !this.id ||
              (this.formData.password && this.formData.password.length > 0),
            message: "Por favor ingresa la contraseña",
            trigger: "blur",
          },
        ],
        password_confirmation: [
          {
            required:
              !this.id ||
              (this.formData.password && this.formData.password.length > 0),
            message: "Por favor ingresa la confirmación",
            trigger: "blur",
          },
        ],
        credential: [
          {
            required: true,
            message: "Por favor ingresa la cédula",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: "Por favor ingresa el correo",
            trigger: "blur",
          },
        ],
        grade: [
          {
            required: true,
            message: "Por favor ingresa el grado",
            trigger: "blur",
          },
        ],
      };
    },
    passwordMatch() {
      return this.formData.password === this.formData.password_confirmation;
    },
    gradeList() {
      return grades;
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
      const result = await this.store.getUser(this.id);
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
      this.$refs["userForm"].validate(async (valid) => {
        if (valid) {
          if (this.formData.password?.length > 0 && !this.passwordMatch) {
            ElMessage({
              type: "error",
              message: "La contraseña y la confirmación no coinciden",
            });
            return;
          }
          this.loading = true;
          const user = { ...this.formData };
          if (!this.id) {
            user.role = "user";
          }
          const result = await this.store.postUser(user);
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
    :title="readOnly ? 'Usuario' : `${id > 0 ? 'Editar' : 'Registrar'} usuario`"
    v-model="modalVisible"
    :before-close="handleClose"
    :width="screen.dialogWidth"
  >
    <el-form
      ref="userForm"
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
      <el-form-item label="Contraseña" prop="password" v-if="!readOnly">
        <el-input
          v-model="formData.password"
          type="password"
          autocomplete="off"
          :disabled="readOnly || loading"
        />
      </el-form-item>
      <el-form-item
        label="Confirmación"
        prop="password_confirmation"
        v-if="!readOnly"
      >
        <el-input
          v-model="formData.password_confirmation"
          type="password"
          autocomplete="off"
          :disabled="readOnly || loading"
        />
      </el-form-item>
      <el-form-item label="Cédula" prop="credential">
        <el-input
          v-model="formData.credential"
          autocomplete="off"
          :disabled="readOnly || loading"
        />
      </el-form-item>
      <el-form-item label="Correo" prop="email">
        <el-input
          type="email"
          v-model="formData.email"
          autocomplete="off"
          :disabled="readOnly || loading"
        />
      </el-form-item>
      <el-form-item label="Grado" prop="grade">
        <el-select
          v-model="formData.grade"
          placeholder="Seleccione"
          :disabled="readOnly || loading"
        >
          <el-option
            v-for="(grade, key) in gradeList"
            :key="`grade-${key}`"
            :label="grade.label"
            :value="grade.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Es visitante" prop="is_visit">
        <el-switch
          v-model="formData.is_visit"
          :disabled="readOnly || loading"
        />
      </el-form-item>
      <el-form-item label="Unidad" prop="visit_unity" v-if="formData.is_visit">
        <el-input
          v-model="formData.visit_unity"
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
