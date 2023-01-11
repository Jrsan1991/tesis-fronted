<script>
import { defineComponent } from "vue";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/user";
import { useSessionStore } from "@/stores/session";
import { getError } from "@/utils/helpers";
import grades from "@/data/grades";
import resize from "@/components/resize";

export default defineComponent({
  name: "ProfileModal",
  mixins: [resize],
  setup() {
    const store = useUserStore();
    const storeSession = useSessionStore();
    return {
      store,
      storeSession,
    };
  },
  data() {
    return {
      formData: {},
    };
  },
  computed: {
    rules() {
      return {
        password: [
          {
            required: true,
            message: "Por favor ingresa la contraseña",
            trigger: "blur",
          },
        ],
        password_confirmation: [
          {
            required: true,
            message: "Por favor ingresa la confirmación",
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
    this.getData();
  },
  methods: {
    async getData() {
      const result = await this.store.getUser(this.storeSession.user.id);
      if (result.error === 0) {
        const { created_at, updated_at, email_verified_at, ...data } =
          result.data;
        this.formData = data;
      }
    },
    submitForm() {
      this.$refs["userForm"].validate(async (valid) => {
        if (valid) {
          if (this.formData.password?.length > 0 && !this.passwordMatch) {
            ElMessage({
              type: "error",
              message: "La contraseña y la confirmación no coinciden",
            });
            return;
          }
          const result = await this.store.postUser({ ...this.formData });
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
            this.storeSession.getLoggedUser();
          }
        } else {
          return false;
        }
      });
    },
  },
});
</script>

<template>
  <el-row justify="center">
    <el-col :xs="24" :sm="14" :md="14" :lg="12">
      <el-form
        ref="userForm"
        v-loading="store.loading"
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
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="Contraseña" prop="password">
          <el-input
            v-model="formData.password"
            type="password"
            autocomplete="off"
            :disabled="store.loading"
          />
        </el-form-item>
        <el-form-item label="Confirmación" prop="password_confirmation">
          <el-input
            v-model="formData.password_confirmation"
            type="password"
            autocomplete="off"
            :disabled="store.loading"
          />
        </el-form-item>
        <el-form-item label="Cédula" prop="credential">
          <el-input
            v-model="formData.credential"
            autocomplete="off"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="Correo" prop="email">
          <el-input
            type="email"
            v-model="formData.email"
            autocomplete="off"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="Grado" prop="grade">
          <el-select
            v-model="formData.grade"
            placeholder="Seleccione"
            :disabled="true"
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
          <el-switch v-model="formData.is_visit" :disabled="true" />
        </el-form-item>
        <el-form-item
          label="Unidad"
          prop="visit_unity"
          v-if="formData.is_visit"
        >
          <el-input
            type="number"
            v-model="formData.visit_unity"
            autocomplete="off"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item>
          <div class="align-right">
            <el-button
              type="primary"
              @click="submitForm()"
              :loading="store.loading"
              >Guardar</el-button
            >
          </div>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style scoped></style>
