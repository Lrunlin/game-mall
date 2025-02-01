<template>
  <div v-if="isLoading">
    <van-skeleton title :row="3" />
    <van-skeleton title :row="3" />
    <van-skeleton title :row="3" />
  </div>
  <div v-else class="pb-10">
    <div v-if="data?.success">
      <van-nav-bar title="我的收藏" left-text="返回" left-arrow @click-left="router.back()" />

      <van-swipe-cell
        v-if="data?.data.length"
        v-for="(item, index) in data?.data"
        :key="item.collection_id"
      >
        <van-card
          :thumb="axios.defaults.baseURL + '/' + item.commodity_cover"
          @click="router.push(`/client/commodity/${item.item_id}`)"
        >
          <template #title>
            <div class="font-bold text-lg">{{ item.commodity_name }}</div>
            <div class="mt-1 text-sm text-gray-500">
              <div class="ml-2 truncate">{{ item.commodity_description }}</div>
            </div>
          </template>
        </van-card>
        <template #right>
          <van-button
            text="取消收藏"
            type="danger"
            class="!h-full"
            @click="unCollection(item.item_id)"
          />
        </template>
      </van-swipe-cell>
      <van-empty v-else :image="empty" image-size="100" description="什么也没有收藏哦" />
    </div>
  </div>
</template>
<script setup>
// import { onMounted, onUnmounted } from "vue";
import useFetch from "@/hooks/useFetch";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import empty from "@/assets/empty.png";
import { showNotify } from "vant";
import { computed } from "vue";
import { watchEffect } from "vue";

let route = useRoute();
let router = useRouter();
let { data, isLoading, refetch } = useFetch("/collection");

function unCollection(id) {
  axios.delete(`/collection/${id}`).then(res => {
    if (res.data.success) {
      data.value.data = data?.value?.data.filter(item => item.item_id != id);
    } else {
      showNotify({ type: "danger", message: res.data.message });
    }
  });
}

function formatNumber(value) {
  if (value < 1000) {
    return value.toString();
  } else if (value < 10000) {
    const thousands = Math.floor(value / 1000);
    return `${thousands}千`;
  } else {
    const tenThousandths = (value / 10000).toFixed(2);
    return `${tenThousandths}万`;
  }
}
</script>
<style scoped lang="scss"></style>

<route lang="json">
{
  "meta": {
    "layout": "client-empty"
  }
}
</route>
