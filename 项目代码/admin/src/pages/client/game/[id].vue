<template>
  <van-nav-bar title="商品列表" left-text="返回" left-arrow @click-left="router.back()" />
  <div class="flex h-screen-navbar">
    <van-sidebar v-model="active" class="h-full">
      <van-sidebar-item
        v-if="data?.data"
        v-for="(item, index) in data?.data"
        :key="item.id"
        :title="item.name"
        @click="search(item.id)"
      />
    </van-sidebar>
    <div class="ml-2 flex-1">
      <div v-if="commodityIsLoading">
        <van-skeleton title :row="3" />
        <van-skeleton title :row="3" />
      </div>
      <div v-else>
        <div v-if="commodityData?.length">
          <van-card
            @click="router.push(`/client/commodity/${item.id}`)"
            v-for="(item, index) in commodityData"
            :key="item.id"
            :num="item.inventory"
            :price="item.price"
            :desc="item.description"
            :title="item.name"
            :thumb="`${axios.defaults.baseURL}/${item.cover}`"
          />
        </div>
        <van-empty v-else :image="empty" image-size="100" description="暂时没有商品发布" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import useFetch from "@/hooks/useFetch";
import empty from "@/assets/empty.png";
import axios from "axios";
import { showSuccessToast, showFailToast } from "vant";
import { computed } from "vue";

let route = useRoute();
let router = useRouter();

let { data, isLoading } = useFetch("/game");
// let { data: commodityData, isLoading: commodityIsLoading } = useFetch("/commodity", {
//   params: { game: route.params.id },
// });

let active = ref(false);
watchEffect(() => {
  if (data?.value?.data) {
    active.value = data?.value?.data?.findIndex(item => item.id == route.params.id);
  }
});

let commodityData = ref([]);
let commodityIsLoading = ref(true);

function search(id) {
  commodityIsLoading.value = true;
  axios
    .get(`/commodity`, {
      params: { game: id || route.params.id, inventory: true },
    })
    .then(res => {
      commodityData.value = res.data.data;
    })
    .finally(() => {
      commodityIsLoading.value = false;
    });
}
search();
</script>
<style lang="scss" scoped>
.h-screen-navbar {
  height: calc(100vh - 50px); /* 50px 是 NavBar 的高度，根据实际情况调整 */
}

/* 设置侧边栏的高度为父元素高度 */
.van-sidebar {
  background: #f7f8fa;
  height: 100%;
}
</style>
