<template>
  <el-card>
    <GameFrom @onSubmit="onSubmit" :key="key" />
  </el-card>
</template>
<script setup>
import { ref } from "vue";
import GameFrom from "@/components/admin/GameFrom.vue";
import axios from "axios";
import { ElMessage } from "element-plus";

let key = ref(+new Date());
function onSubmit(params) {
  axios.post(`/game`, params).then(res => {
    if (res.data.success) {
      ElMessage({
        message: res.data.message,
        type: "success",
      });
      key.value++;
    } else {
      ElMessage({
        message: res.data.message,
        type: "error",
      });
    }
  });
}
</script>
<style scoped lang="scss"></style>
