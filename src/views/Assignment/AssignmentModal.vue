<script>
import { defineComponent } from "vue";
import { ElNotification } from "element-plus";
import { useAssignmentStore } from "@/stores/assignment";
import { useProductStore } from "@/stores/product";
import { useUserStore } from "@/stores/user";
import { getError } from "@/utils/helpers";

export default defineComponent({
  name: "AssignmentModal",
  props: {
    id: Number,
    readOnly: Boolean,
    screen: Object,
    user: {
      type: Object,
      default: null,
    },
  },
  setup() {
    const store = useAssignmentStore();
    const storeUser = useUserStore();
    const storeProduct = useProductStore();
    return {
      store,
      storeUser,
      storeProduct,
    };
  },
  data() {
    return {
      loading: false,
      modalVisible: true,
      formData: {},
      userLoading: false,
      users: [],
      products: [],
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
    } else {
      this.formData = {
        document_number: '00001',
        transaction_date: new Date(),
        is_return: false,
        voided: false,
        details: [],
      }
    }
  },
  methods: {
    async loadUsers(query) {
      const result = await this.storeUser.findUsers({keyword: query});
      if (result.error === 0){
        this.users = result.data.data;
      }
    },
    async loadProduct(query) {
      const result = await this.storeProduct.findProducts({keyword: query});
      console.log(query);
      if (result.error === 0){
        this.products = result.data.data;
      }
    },
    async getData() {
      this.loading = true;
      const result = await this.store.getAssignment(this.id);
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
      this.$refs["assignmentForm"].validate(async (valid) => {
        if (valid) {
          this.loading = true;
          const result = await this.store.postAssignment({ ...this.formData });
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
    addLine() {
      this.formData.details.push({
        quantity: 0,
        description: null,
        product_id: null,
      });
    },
    deleteLine(index) {
      if (index > -1) {
        this.formData.details.splice(index, 1);
      }
    },
  },
});
</script>

<template>
  <el-dialog
    :title="
      readOnly ? 'Asignación' : `${id > 0 ? 'Editar' : 'Registrar'} asignación`
    "
    v-model="modalVisible"
    :before-close="handleClose"
    :width="screen.dialogWidth"
  >
    <el-form
      ref="assignmentForm"
      v-loading="loading"
      :model="formData"
      status-icon
      :rules="rules"
      label-width="120"
      :label-position="screen.labelPosition"
    >
      <el-form-item label="N° Documento" prop="document_number">
        <el-input
          v-model="formData.document_number"
          autocomplete="off"
          :disabled="readOnly || loading"
        />
      </el-form-item>
      <el-form-item label="Fecha" prop="transaction_date">
        <el-date-picker
          v-model="formData.transaction_date"
          type="date"
          placeholder="Fecha asignación"
          style="width: 100%;"
        />
      </el-form-item>
      <el-form-item prop="is_return">
        <el-checkbox v-model="formData.is_return" label="Es devolución" />
      </el-form-item>
      <el-form-item label="Usuario" prop="user_id">
        <el-select
          v-model="formData.user_id"
          placeholder="Seleccione"
          filterable
          remote
          :remote-method="loadUsers"
          :loading="storeUser.loading"
          :disabled="readOnly || loading"
          style="width: 100%;"
        >
          <el-option
            v-for="(user, key) in users"
            :key="`user-${key}`"
            :label="user.credential + ' - ' + user.name"
            :value="user.id"
          />
        </el-select>
      </el-form-item>
      <el-card>
        <template #header>
          <div class="card-header">
            <span class="data">Detalle</span>
          </div>
        </template>
        <div>
          <el-empty v-if="formData.details.length === 0"/>
          <el-card
            v-for="(detail, index) in formData.details"
            :key="'detail' + detail.id"
            shadow="always"
            class="mobile_card"
          >
            <el-row :gutter="20">
              <el-col :sm="24" :md="10" :lg="7">
                <el-form-item label="Cantidad" :prop="index+'quantity'">
                  <el-input-number v-model="detail.quantity" size="small" style="width: 100%;" />
                </el-form-item>
              </el-col>
              <el-col :sm="24" :md="14" :lg="17">
                <el-form-item label="Producto" :prop="index+'product_id'">
                  <el-select
                    v-model="detail.product_id"
                    placeholder="Seleccione"
                    filterable
                    remote
                    :remote-method="loadProduct"
                    :loading="storeUser.loading"
                    :disabled="readOnly || loading"
                    style="width: 100%;"
                  >
                    <el-option
                      v-for="(product, key) in products"
                      :key="`product-${key}`"
                      :label="product.category.name + ' - ' + product.name"
                      :value="product.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :sm="24" :md="24">
                <el-form-item label="Descripción" :prop="index+'description'">
                  <el-input
                    v-model="detail.description"
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    size="small"
                  />
                </el-form-item>
              </el-col>
              <el-col :sm="24" :md="24">
                <div class="add_line_div">
                  <el-button
                    type="danger"
                    size="small"
                    @click="deleteLine(index)"
                  >
                    <font-awesome-icon class="button_icon" icon="fa-solid fa-trash" />
                  </el-button>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </div>
        <div class="add_line_div">
          <el-button
            type="primary"
            @click="addLine"
            v-if="!readOnly"
          >
            <font-awesome-icon class="button_icon" icon="fa-solid fa-plus" /> Añadir linea
          </el-button>
        </div>
      </el-card>
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

<style scoped>
.add_line_div{
  text-align: right;
}
.mobile_card {
  margin: 5px 0 5px 0;
}
</style>
