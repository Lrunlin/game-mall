<template>
  <div v-if="props.data">
    <div
      v-if="props.data.length"
      v-for="(item, index) in props.data"
      :key="index + '' + item.index"
      :class="index && 'mt-2'"
    >
      <div
        class="bg-white rounded p-2"
        @click="
          router.push(
            route.path.includes('/client/commodity')
              ? `/client/commodity/edit/${item.id}`
              : `/client/commodity/${item.id}`
          )
        "
      >
        <div>
          <van-image class="w-full" :src="`${axios.defaults.baseURL}/${item.cover}`" alt="cover" />
          <div class="text-zinc-100 bg-zinc-600 truncate text-sm py-1">
            <span class="ml-2">{{ item.description }}</span>
          </div>
        </div>
        <div class="p-2">
          <div class="flex justify-between items-center">
            <div class="text-base mt-2 font-bold truncate">
              {{ item.name }}
            </div>
            <div class="text-xs text-gray-400">共 {{ item.collection_count }} 人收藏</div>
          </div>
          <!-- tags -->
          <div class="mt-3 flex">
            <div
              class="text-orange-400 text-sm"
              :class="index && 'ml-2'"
              v-for="(item, index) in item.tags"
              :key="index"
            >
              {{ item }}
            </div>
          </div>
          <!-- 底部 -->
          <div class="flex items-center justify-between mt-6">
            <div class="flex items-center">
              <img
                class="w-6 h-6 rounded-full"
                :src="`${axios.defaults.baseURL}/${item.user_avatar}`"
                alt="cover"
              />
              <span class="ml-2 text-gray-600 text-sm">{{ item.user_name }}</span>
            </div>
            <div class="mt-2 flex justify-end items-center">
              <span class="!text-orange-600 text-xs">￥</span>
              <span class="!text-orange-600 text-lg font-bold">{{ formatNumber(item.price) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <van-empty v-else description="空" />
  </div>
  <div v-if="props.isLoading">
    <van-skeleton title :row="3" />
    <van-skeleton title :row="3" />
    <van-skeleton title :row="3" />
  </div>
  <van-empty v-if="props.error" image="error" description="加载错误" />
</template>
<script setup>
import { Waterfall } from "vue-waterfall-plugin-next";
import "vue-waterfall-plugin-next/dist/style.css";
import axios from "axios";

let route = useRoute();
let router = useRouter();

let props = defineProps(["data", "isLoading", "error"]);

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
