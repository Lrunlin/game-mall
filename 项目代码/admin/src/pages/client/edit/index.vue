<template>
  <van-nav-bar title="发布文章" left-text="返回" left-arrow @click-left="router.back()" />
  <ArticleEdit @onSubmit="submit" :key="key" />
</template>
<script setup>
import { ref } from "vue";
import axios from "axios";
import useFetch from "@/hooks/useFetch";
import empty from "@/assets/empty.png";
import { computed } from "vue";
import ArticleEdit from "@/components/user/Edit";
import { showNotify } from "vant";

let router = useRouter();

let key = ref(+new Date());
function submit(params) {
  axios.post(`/article`, params).then(res => {
    if (res.data.success) {
      showNotify({ type: "success", message: res.data.message });
      key.value = Math.random() + "" + Math.random();
    } else {
      showNotify({ type: "danger", message: res.data.message });
    }
  });
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
