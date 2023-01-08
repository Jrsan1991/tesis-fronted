<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Search",
  emits: ["search", "new"],
  data() {
    return {
      keyword: "",
    };
  },
  computed: {
    query() {
      return this.$route.query;
    },
  },
  created() {
    if (this.query.keyword) {
      this.keyword = this.query.keyword;
    }
  },
  methods: {
    async handleSearch() {
      const query = this.keyword.length > 0 ? { keyword: this.keyword } : {};
      const keyword = this.query.keyword;
      await this.$router.replace({ path: this.$route.path, query: query });
      if (this.keyword.length > 0 || (keyword && keyword.length > 0)) {
        this.$emit("search");
      }
    },
    async handleClear() {
      if (this.keyword.length > 0) {
        this.keyword = "";
        const query = {};
        await this.$router.replace({ path: this.$route.path, query: query });
        this.$emit("search");
      }
    },
  },
});
</script>

<template>
  <el-row>
    <el-col :xs="24" :sm="24" :md="20" :lg="20">
      <el-input
        v-model="keyword"
        placeholder="Ingrese el texto a buscar"
        @keyup.enter="handleSearch"
      />
    </el-col>
    <el-col :xs="24" :sm="24" :md="4" :lg="4" align="right">
      <el-button type="primary" @click="handleSearch"> <font-awesome-icon style="margin-right: 5px;" icon="fa-solid fa-search" /> Buscar </el-button>
      <el-button type="warning" @click="handleClear"> <font-awesome-icon style="margin-right: 5px;" icon="fa-solid fa-trash" /> Limpiar </el-button>
    </el-col>
  </el-row>
</template>

<style scoped>
.el-col {
  margin-bottom: 1rem;
}
.flex-grow {
  flex-grow: 1;
}
.flex-shrink {
  flex-shrink: 0;
}
</style>
