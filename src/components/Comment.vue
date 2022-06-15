<template>
  <el-card class="box-card">
    <template #header>
      <span>聊天记录</span>
    </template>
    <el-scrollbar max-height="400px" v-if="showBox">
      <div
        v-for="item in commentList"
        :key="item"
        class="scrollbar-item"
        v-html="item"
      ></div>
    </el-scrollbar>
  </el-card>
  <vue-at @done="done" />
</template>

<script setup>
import VueAt from "./VueAt.vue";
import { ref, computed } from "vue";

const commentList = ref([]);
const done = ({ atUsers, content }) => {
  console.log(`-----@人员数据：`, atUsers);
  console.log(`-----@输入内容：`, content);
  commentList.value.push(content);
};

const showBox = computed(() => {
  return commentList.value.length != 0;
});
</script>

<style lang="scss">
.box-card {
  margin-bottom: 20px;
}

.scrollbar-item {
  border-bottom: 1px solid #dcdfe6;
  &:last-child {
    border: none;
  }
}
</style>
