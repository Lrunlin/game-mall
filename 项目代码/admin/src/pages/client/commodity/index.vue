<template>
  <van-nav-bar title="我的商品" left-text="返回" left-arrow @click-left="router.back()" />
  <div class="px-1 mt-3 pb-4">
    <CommodityList :isLoading="isLoading" :data="data?.data" />
  </div>
</template>
<script setup>
import { ref } from "vue";
import axios from "axios";
import useFetch from "@/hooks/useFetch";
import { showNotify } from "vant";
import CommodityList from "@/components/user/CommodityList";

let { data, isLoading } = useFetch("/commodity/user/list", { params: { user: true } });

let route = useRoute();
let router = useRouter();
</script>
<style scoped lang="scss"></style>
