<template>
  <van-nav-bar title="我的文章" left-text="返回" left-arrow @click-left="router.back()" />

  <ArticleList :isLoading="articleIsLoading" :data="articleData?.data" />
</template>
<script setup>
import { ref } from "vue";
import ArticleList from "@/components/user/ArticleList/index";
import useFetch from "@/hooks/useFetch";
let { data: articleData, isLoading: articleIsLoading } = useFetch("/article", {
  params: { user: true },
});
let router = useRouter();
</script>
<style scoped lang="scss"></style>
