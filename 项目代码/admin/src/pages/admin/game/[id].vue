<template>
  <el-card>
    <div v-if="isLoading">
      <el-skeleton :rows="5" />
      <el-skeleton :rows="5" class="mt-2" />
    </div>
    <div v-else>
      <GameFrom v-if="data?.data" :initValue="data?.data" @onSubmit="onSubmit" />
      <el-empty v-else description="description" />
    </div>
  </el-card>
</template>
<script setup>
import { ref } from "vue";
import GameFrom from "@/components/admin/GameFrom.vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import useFetch from "@/hooks/useFetch";
let route = useRoute();
let router = useRouter();
let { data, isLoading } = useFetch(`/game/${route.params.id}`);

let key = ref(+new Date());
function onSubmit(params) {
  axios.put(`/game/${params.id}`, params).then(res => {
    if (res.data.success) {
      ElMessage({
        message: res.data.message,
        type: "success",
      });
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
