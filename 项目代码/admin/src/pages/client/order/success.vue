<template>
  <van-nav-bar title="购买成功" left-text="返回" left-arrow @click-left="router.back()" />
  <div class="flex justify-center mt-4">
    <img class="w-3/5 max-w-[300px]" :src="assets" alt="assets" />
  </div>
  <div class="bg-gradient-to-r from-red-500 to-blue-500 text-center mt-4 font-bold text-lg">
    <div>下单成功</div>
  </div>
  <div class="flex justify-center mt-4">
    <van-button
      color="linear-gradient(to right, #ff6034, #ee0a24)"
      @click="router.replace('/client/order')"
      block
      round
      class="w-3/5 max-w-[300px]"
    >
      去看看
    </van-button>
  </div>
</template>
<script setup>
import { ref, watchEffect } from "vue";
import useFetch from "@/hooks/useFetch";
import axios from "axios";
import empty from "@/assets/empty.png";
import { showNotify } from "vant";
import assets from "@/assets/成功.svg";

let route = useRoute();
let router = useRouter();
</script>
