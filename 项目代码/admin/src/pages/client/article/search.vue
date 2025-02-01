<template>
  <van-nav-bar left-arrow @click-left="router.back()" title="文章搜索"> </van-nav-bar>
  <ArticleList :isLoading="isLoading" :data="data?.data" />
</template>
<script setup>
import { ref } from "vue";
import useFetch from "@/hooks/useFetch";
import ArticleList from "@/components/user/ArticleList/index";

let route = useRoute();
let router = useRouter();

let { data, isLoading } = useFetch("/article/list/search", {
  params: { keyword: route.query.keyword },
});
watchEffect(() => {
  console.log(data.value);
});
</script>
<style scoped lang="scss"></style>
<route lang="json">
{
  "meta": {
    "layout": "client-empty"
  }
}
</route>
