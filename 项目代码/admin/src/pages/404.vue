<template>
  <Header title="404" />
  <van-empty image="error" description="404">
    <van-button round type="primary" @click="router.replace('/')">首页</van-button>
  </van-empty>
</template>
<script setup>
import { useRouter } from "vue-router";
import Header from "@/components/Header/index";
let router = useRouter();
</script>
<style scoped lang="scss"></style>
