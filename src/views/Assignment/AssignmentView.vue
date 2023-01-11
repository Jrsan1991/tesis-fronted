<script>
import { defineComponent } from "vue";
import { useAssignmentStore } from "@/stores/assignment";
import moment from 'moment';
import 'moment/locale/es';
import AssignmentModal from "./AssignmentModal.vue";
import Search from "@/components/Search.vue";
import Pager from "@/components/Pager.vue";
import resize from "@/components/resize";

export default defineComponent({
  name: "AssignmentView",
  components: {
    AssignmentModal,
    Search,
    Pager,
  },
  setup() {
    const store = useAssignmentStore();
    return {
      store,
    };
  },
  mixins: [resize],
  data() {
    return {
      modalVisible: false,
      readOnly: false,
      assignments: [],
      row: {},
      pageSize: 10,
      total: 10,
    };
  },
  created() {
    this.moment = moment;
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      const result = await this.store.getAssignments();
      if (result.error === 0) {
        const { data, meta } = result.data;
        this.assignments = data;
        this.pageSize = meta.per_page;
        this.total = meta.total;
      }
    },
    handleClick(row, readOnly) {
      this.row = row;
      this.readOnly = readOnly;
      this.modalVisible = true;
    },
    modalCancel(value) {
      this.modalVisible = value;
    },
    modalConfirm(value) {
      this.getData();
      this.modalVisible = value;
    },
  },
});
</script>

<template>
  <el-row>
    <el-col class="align-right">
      <el-button
        type="success"
        @click="handleClick({}, false)"
        :disabled="store.loading"
      >
        <font-awesome-icon class="button_icon" icon="fa-solid fa-plus" /> Nuevo
      </el-button>
    </el-col>
  </el-row>
  <Search @search="getData" />
  <el-card v-loading="store.loading">
    <div class="flex" v-if="screen.mobile">
      <el-card
        v-for="item in assignments"
        :key="'assignment' + item.id"
        shadow="always"
        class="mobile_card"
      >
        <template #header>
          <div class="card-header">
            <span class="data">{{ item.document_number }}</span>
            <div>
              <el-button
                link
                class="button"
                type="primary"
                size="small"
                @click="() => handleClick(item, true)"
                :disabled="store.loading"
              >
                <font-awesome-icon class="button_icon" icon="fa-solid fa-eye" />
              </el-button>
              <el-button
                link
                class="button"
                type="primary"
                size="small"
                @click="() => handleClick(item, false)"
                :disabled="store.loading"
              >
                <font-awesome-icon
                  class="button_icon"
                  icon="fa-solid fa-edit"
                />
              </el-button>
            </div>
          </div>
        </template>
        <div class="card-header">
          <p class="label">Fecha:</p>
          <p class="data">{{ moment(item.transaction_date).format("YYYY-MM-DD") }}</p>
        </div>
        <div class="card-header">
          <p class="label">Tipo:</p>
          <p class="data">{{ item.is_return ? 'Recepción' : 'Entrega' }}</p>
        </div>
        <div class="card-header">
          <p class="label">Estado:</p>
          <p class="data">{{ item.voided ? 'Anulada' : 'Activo' }}</p>
        </div>
        <div class="card-header">
          <p class="label">Usuario:</p>
          <p class="data">{{ item.user.name }}</p>
        </div>
        <div class="card-header">
          <p class="label">Cedula:</p>
          <p class="data">{{ item.user.credential }}</p>
        </div>
      </el-card>
    </div>
    <el-table v-if="!screen.mobile" :data="assignments" stripe width="100%">
      <el-table-column prop="document_number" label="Número documento" min-width="150" />
      <el-table-column prop="transaction_date" label="Fecha" min-width="150">
        <template #default="scope">
          {{ moment(scope.transaction_date).format("YYYY-MM-DD") }}
        </template>
      </el-table-column>
      <el-table-column prop="is_return" label="Tipo" min-width="100">
        <template #default="scope">
          {{ scope.is_return ? 'Recepción' : 'Entrega' }}
        </template>
      </el-table-column>
      <el-table-column prop="user.name" label="Usuario" min-width="150" />
      <el-table-column prop="user.credential" label="Cédula" min-width="120" />
      <el-table-column prop="voided" label="Estado" min-width="150">
        <template #default="scope">
          {{ scope.voided ? 'Anulada' : 'Activo' }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="Acciones" width="100">
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="small"
            @click="() => handleClick(scope.row, true)"
            :disabled="store.loading"
          >
            <font-awesome-icon class="button_icon" icon="fa-solid fa-eye" />
          </el-button>
          <el-button
            link
            type="primary"
            size="small"
            @click="() => handleClick(scope.row, false)"
            :disabled="store.loading"
          >
            <font-awesome-icon class="button_icon" icon="fa-solid fa-edit" />
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pager :pageSize="pageSize" :total="total" @search="getData" />
  </el-card>
  <AssignmentModal
    v-if="modalVisible"
    :id="row.id"
    :readOnly="readOnly"
    :screen="this.screen"
    @modalCancel="modalCancel"
    @modalConfirm="modalConfirm"
  />
</template>

<style scoped>
.align-right {
  margin-bottom: 1rem;
  display: flex;
  justify-content: right;
  align-items: right;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mobile_card {
  margin: 5px 0 5px 0;
}

.data {
  font-weight: bold;
}
</style>
