<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Pager",
  props: {
    pageSize: Number,
    total: Number,
  },
  data() {
    return {
      page: 1,
    };
  },
  computed: {
    query() {
      return this.$route.query;
    },
  },
  watch: {
    query: function (newValue, oldValue) {
      if (oldValue.page && !newValue.page) {
        this.page = 1;
      }
    },
  },
  created() {
    if (this.query.page) {
      this.page = Number(this.query.page);
    }
  },
  methods: {
    async handleChange(page) {
      const query = { ...this.query, page: page };
      await this.$router.replace({ path: this.$route.path, query: query });
      this.$emit("search");
    },
  },
});
</script>

<template>
  <el-row>
    <el-col class="align-center">
      <el-pagination
        v-model:current-page="page"
        :page-size="pageSize"
        :pager-count="7"
        layout="prev, pager, next"
        :total="total"
        @current-change="handleChange"
      />
    </el-col>
  </el-row>
</template>

<style scoped>
.align-center {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
