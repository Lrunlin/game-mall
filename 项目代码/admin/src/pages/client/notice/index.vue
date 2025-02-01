<template>
  <van-nav-bar title="通知信息" left-text="返回" left-arrow @click-left="router.back()" />
  <div
    class="p-4 border-0 border-solid border-b border-gray-100"
    v-if="data?.data?.length"
    v-for="(item, index) in data?.data"
    :key="index"
  >
    <div class="flex justify-between">
      <div class="font-bold break-all">{{ item.title }}</div>
      <div class="w-15 flex items-center">
        <van-tag v-if="item.isTop" plain type="primary" class="mr-1">置顶</van-tag>
        <van-tag v-if="!item.is_read" plain type="danger">未读</van-tag>
      </div>
    </div>
    <div class="break-all" v-html="item.content"></div>
    <div class="mt-4">{{ moment(item.create_time).fromNow() }}</div>
  </div>
  <van-empty v-else :image="empty" image-size="100" description="暂时没有添加商品" />
</template>
<script setup>
import { ref } from "vue";
import useFetch from "@/hooks/useFetch";
import empty from "@/assets/empty.png";
import moment from "moment ";
import axios from "axios";

let { data } = useFetch("/notice");
let stop = watchEffect(() => {
  if (data.value?.data && data.value?.data.map(item => item.id)?.length) {
    axios
      .post("/notice/history", { noticeIds: data?.value?.data.map(item => item.id) })
      .then(() => {
        console.log(res.data);
      })
      .catch(() => {});
    setTimeout(() => {
      stop();
    }, 0);
  }
});

let router = useRouter();
</script>
<style scoped lang="scss"></style>
