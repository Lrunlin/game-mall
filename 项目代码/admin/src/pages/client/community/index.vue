<template>
  <van-nav-bar title="社区">
    <template #right>
      <van-icon name="add-o" @click="router.push(`/client/edit`)" size="22" />
    </template>
  </van-nav-bar>
  <div class="bg-white"><ArticleList :data="data?.data" :isLoading="isLoading" /></div>
</template>
<script setup>
import { ref } from "vue";
import CommodityList from "@/components/user/CommodityList";
import ArticleList from "@/components/user/ArticleList";
import useFetch from "@/hooks/useFetch";
import axios from "axios";
import { computed } from "vue";

let { data, isLoading } = useFetch("/article");

let router = useRouter();
let search = ref("");
</script>
<style scoped lang="scss">
.custom-indicator {
  position: absolute;
  right: 5px;
  bottom: 5px;
  padding: 2px 5px;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.1);
}
</style>
<route lang="json">
{
  "meta": {
    "layout": "client"
  }
}
</route>
