<template>
  <div v-if="props?.data?.length">
    <div
      v-for="(item, index) in props.data"
      :key="item.id + '' + index"
      class="px-4 py-3 border-0 border-solid border-b border-gray-100"
      @click="
        router.push(
          route.path == '/client/article' ? `/client/edit/${item.id}` : `/client/article/${item.id}`
        )
      "
    >
      <!-- 顶部1个图片 -->
      <div v-if="item?.cover?.length == 1" class="flex justify-between">
        <div class="text-[#111e36] text-lg mr-2 line-clamp-3 flex-1">
          {{ item.title }}
        </div>
        <van-image class="w-1/3" :src="axios.defaults.baseURL + '/' + item.cover" alt="image" />
      </div>
      <!-- 三个图片 -->
      <div v-else>
        <div class="text-[#111e36] text-lg mr-2 line-clamp-2">
          {{ item.title }}
        </div>
        <div class="h-24 mt-2 flex">
          <van-image
            v-for="(el, index) in item.cover"
            :key="index"
            class="max-w-[33.3333333%] w-1/3 h-full overflow-hidden"
            :class="[
              index === 0 && 'rounded-l-md',
              index === item.cover.length - 1 && 'rounded-r-md',
              { 'ml-1': index > 0 },
            ]"
            :src="axios.defaults.baseURL + '/' + el"
            alt="image"
          />
        </div>
      </div>
      <!-- 底部 -->
      <div class="text-[#828ca0] text-xs flex mt-2 justify-between">
        <div class="flex">
          <div>{{ item.comment_count }} 个评论</div>
          <div class="ml-2">{{ item?.admin_data?.name || item?.user_data?.name }}</div>
          <div class="ml-2">{{ moment(item.create_time).fromNow() }}</div>
        </div>
        <div v-if="item?.game_data?.name">{{ item?.game_data?.name }}</div>
      </div>
    </div>
  </div>
  <van-empty v-else description="空" />
  <div v-if="props.isLoading">
    <van-skeleton title :row="3" />
    <van-skeleton title :row="3" />
    <van-skeleton title :row="3" />
  </div>
</template>
<script setup>
import { watchEffect } from "vue";
import "vue-waterfall-plugin-next/dist/style.css";
import axios from "axios";
import moment from "moment";

let route = useRoute();
let router = useRouter();

let props = defineProps(["data", "isLoading"]);
</script>
<style scoped lang="scss"></style>
