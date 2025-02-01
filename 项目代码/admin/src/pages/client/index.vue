<template>
  <!-- 顶部 -->
  <div class="flex items-center p-2 bg-white">
    <img class="w-7" src="/logo.svg" alt="logo" />
    <van-search class="w-full" v-model="search" placeholder="请输入搜索关键词" @search="onSearch" />
    <van-badge :content="noticeCount || 0">
      <van-icon name="bell" size="22" color="gray" @click="router.push('/client/notice')" />
    </van-badge>
  </div>
  <!-- banner -->
  <div class="bg-white">
    <div v-if="isLoading" class="w-screen  rounded-sm animate-pulse bg-slate-50"></div>
    <div v-else>
      <van-swipe v-if="data?.data" class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="(item, index) in data.data" :key="item.id">
          <img
            :src="axios.defaults.baseURL + '/' + item.cover"
            alt="banner"
            class="w-screen  rounded-sm"
          />
        </van-swipe-item>
        <template #indicator="{ active, total }">
          <div class="custom-indicator">{{ active + 1 }}/{{ total }}</div>
        </template>
      </van-swipe>
    </div>
  </div>
  <!-- 类型列表 -->
  <div class="bg-white p-2 mt-4 rounded text-center flex flex-wrap">
    <div v-if="gameIsLoading">
      <van-skeleton title :row="3" />
    </div>
    <div
      class="w-1/4"
      v-for="(item, index) in gameData?.data?.slice(0,8)"
      :key="item.id + '' + index"
      @click="router.push(`/client/game/${item.id}`)"
    >
      <div>
        <img class="w-1/3" :src="`${axios.defaults.baseURL}/${item.icon}`" alt="cover" />
      </div>
      <div class="truncate text-sm">
        <span class="">{{ item.name }}</span>
      </div>
    </div>
  </div>
  <!-- 商品 -->
  <div class="px-1 mt-3 pb-4">
    <CommodityList :isLoading="commodityIsLoading" :data="commodityData?.data" />
  </div>
</template>
<script setup>
import { ref } from "vue";
import CommodityList from "@/components/user/CommodityList";
import useFetch from "@/hooks/useFetch";
import axios from "axios";
import { computed } from "vue";

let { data, isLoading } = useFetch("/banner");
let { data: commodityData, isLoading: commodityIsLoading } = useFetch("/commodity/recommend/list");
let { data: gameData, isLoading: gameIsLoading } = useFetch("/game", {
  params: { state: 1 },
});

let { data: noticeData } = useFetch("/notice");
let noticeCount = computed(() => noticeData.value?.data?.filter(item => !item.is_read)?.length);

let router = useRouter();
let search = ref("");
function onSearch() {
  router.push({ path: "/client/commodity/search", query: { keyword: search.value } });
}

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
