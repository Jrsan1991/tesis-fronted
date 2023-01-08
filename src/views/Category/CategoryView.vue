<script>
import { defineComponent } from "vue";
import { useCategoryStore } from "@/stores/category";
import CategoryModal from "./CategoryModal.vue";
import Search from "@/components/Search.vue";
import Pager from "@/components/Pager.vue";
import resize from "@/components/resize";

export default defineComponent({
  name: "CategoryView",
  components: {
    CategoryModal,
    Search,
    Pager,
  },
  setup() {
    const store = useCategoryStore();
    return {
      store,
    };
  },
  mixins: [resize],
  data() {
    return {
      modalVisible: false,
      readOnly: false,
      categories: [],
      row: {},
      pageSize: 10,
      total: 10,
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      const result = await this.store.getCategories();
      if (result.error === 0) {
        const { data, meta } = result.data;
        this.categories = data;
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
        v-for="item in categories"
        :key="'category' + item.id"
        shadow="always"
        class="mobile_card"
      >
        <template #header>
          <div class="card-header">
            <span class="data">{{ item.name }}</span>
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
      </el-card>
    </div>
    <el-table v-if="!screen.mobile" :data="categories" stripe width="100%">
      <el-table-column prop="name" label="Nombre" min-width="150" />
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
  <CategoryModal
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
