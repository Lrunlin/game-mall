<template>
  <van-nav-bar title="商品推荐" fixed placeholder />
  <CommodityList :data="data?.data" :isLoading="isLoading" :error="error" />
</template>
<script setup>
import { ref } from "vue";
import useFetch from "@/hooks/useFetch";
import CommodityList from "@/components/user/CommodityList.vue";

let { data, isLoading, error } = useFetch("/commodity/recommend/list");
</script>
<style scoped lang="scss"></style>
<route lang="json">
{
  "meta": {
    "layout": "client"
  }
}
</route>
