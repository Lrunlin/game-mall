<template>
  <el-card>
    <el-skeleton :rows="5" v-if="isLoading" />
    <div v-else>
      <ArticleEdit v-if="data?.data" :initValue="data?.data" @onSubmit="onSubmit" />
      <el-result v-else icon="error" title="没有找到对应的文章">
        <template #extra>
          <el-button type="primary" @click="router.back()">返回</el-button>
        </template>
      </el-result>
    </div>
  </el-card>
</template>
<script setup>
import { ref } from "vue";
import ArticleEdit from "@/components/admin/ArticleEdit/index";
import axios from "axios";
import { ElMessage } from "element-plus";
import useFetch from "@/hooks/useFetch";

let route = useRoute();
let router = useRouter();

let { data,isLoading } = useFetch(`/article/${route.params.id}`);
watchEffect(() => {
  // console.log(data.value);
});
function onSubmit(params) {
  axios.put(`/article/${route.params.id}`, params).then(res => {
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
