<template>
  <van-nav-bar title="我的消息" />
  <div v-if="isLoading">
    <van-skeleton :row="3" />
    <van-skeleton :row="3" />
    <van-skeleton :row="3" />
  </div>
  <div v-else>
    <div v-if="data?.data.length" class="bg-white">
      <div
        @click="router.push(`/client/message/${item.user_data.id}`)"
        class="px-2 py-1 flex bg-white"
        :class="!index && 'mt-2'"
        v-for="(item, index) in data?.data"
        :key="item.id"
      >
        <img
          class="w-11 h-11 rounded-full"
          :src="axios.defaults.baseURL + '/' + item.user_data.avatar"
          alt="store_cover"
        />
        <div class="ml-2 flex-1">
          <div class="flex justify-between items-center">
            <div class="truncate">{{ item.user_data.name }}</div>
            <div class="text-sm text-gray-400">{{ moment(item.create_time).fromNow() }}</div>
          </div>
          <div>
            <div class="mt-2 w-1/3 truncate break-all">
              {{ item.picture ? "[图片]" : item.content }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <van-empty v-else :image="empty" image-size="100" description="暂时没有聊天哦" />
  </div>
</template>
<script setup>
import { ref } from "vue";
import useFetch from "@/hooks/useFetch";
import empty from "@/assets/empty.png";
import axios from "axios";
import moment from "moment";

let router = useRouter();

let { data, isLoading } = useFetch("/message/user/list");
</script>
<style scoped lang="scss"></style>
<route lang="json">
{
  "meta": {
    "layout": "client"
  }
}
</route>
