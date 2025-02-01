<template>
  <van-nav-bar title="文章修改" left-text="返回" left-arrow @click-left="router.back()">
    <template #right>
      <div>
        <van-button
          :disabled="!data?.data || useUser?.userData?.id != data?.data?.user_id"
          type="danger"
          round
          size="mini"
          @click="remove"
          >删除</van-button
        >
      </div>
    </template>
  </van-nav-bar>
  <div v-if="isLoading">
    <van-skeleton title :row="3" />
    <van-skeleton title :row="3" class="mt-4" />
    <van-skeleton title :row="3" class="mt-4" />
  </div>
  <ArticleEdit v-else-if="data?.data" :initValue="data?.data" @onSubmit="submit" :key="key" />
  <van-empty v-else :image="empty" image-size="100" description="暂时没有添加商品" />
</template>
<script setup>
import { ref } from "vue";
import axios from "axios";
import useFetch from "@/hooks/useFetch";
import empty from "@/assets/empty.png";
import { computed } from "vue";
import ArticleEdit from "@/components/user/Edit";
import { showNotify } from "vant";
import { useUserData } from "@/store/useUserData";
let useUser = useUserData();

let route = useRoute();
let router = useRouter();
let { data, isLoading, refetch } = useFetch(`/article/${route.params.id}`);

let key = ref(+new Date());
function submit(params) {
  axios.put(`/article/${route.params.id}`, params).then(res => {
    if (res.data.success) {
      showNotify({ type: "success", message: res.data.message });
      key.value = Math.random() + "" + Math.random();
    } else {
      showNotify({ type: "danger", message: res.data.message });
    }
  });
}

function remove() {
  axios.delete(`/article/${route.params.id}`).then(res => {
    if (res.data.success) {
      showNotify({ type: "success", message: res.data.message });
      refetch();
    } else {
      showNotify({ type: "error", message: res.data.message });
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
