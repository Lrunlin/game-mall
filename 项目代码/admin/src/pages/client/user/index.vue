<template>
  <van-nav-bar title="我的">
    <template #left>
      <img src="/logo.svg" alt="logo" class="h-6" />
    </template>
  </van-nav-bar>
  <div v-if="store?.userData" class="p-4">
    <div class="flex bg-white rounded-sm p-4">
      <img
        class="w-14 h-14 rounded-full"
        :src="axios.defaults.baseURL + '/' + store?.userData?.avatar"
        alt="face"
      />
      <div class="font-bold text-lg ml-3 mt-1">{{ store?.userData?.name }}</div>
    </div>
    <van-cell-group class="mt-6">
      <van-cell to="/client/collection" title="我的收藏" is-link />
      <van-cell to="/client/commodity" title="我的商品" is-link />
      <van-cell to="/client/article" title="我的文章" is-link />
      <van-cell to="/client/order" title="我的订单" is-link />
      <van-cell to="/client/arbitrate" title="我的仲裁" is-link />
      <van-cell to="/client/set" title="信息修改" is-link />
    </van-cell-group>
    <van-button type="danger" block size="small" class="w-4/5 !mt-4" @click="out"
      >退出登录</van-button
    >
  </div>
</template>
<script setup>
import { ref, watchEffect } from "vue";
import { useUserData } from "@/store/useUserData";
import axios from "axios";
import cookie from "js-cookie";

let router = useRouter();
let store = useUserData();
watchEffect(() => {
  // console.log(store?.userData?.avatar);
});

function out() {
  cookie.remove("token");
  router.replace("/client/sign");
}
</script>
<style scoped lang="scss"></style>
<route lang="json">
{
  "meta": {
    "layout": "client"
  }
}
</route>
