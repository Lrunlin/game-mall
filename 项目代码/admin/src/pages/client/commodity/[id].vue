<template>
  <van-nav-bar left-arrow @click-left="router.back()" title="商品详情"> </van-nav-bar>
  <div v-if="isLoading">
    <van-skeleton title :row="3" />
    <van-skeleton title :row="3" />
    <van-skeleton title :row="3" />
  </div>
  <div v-else class="pb-20">
    <div>
      <div v-if="data?.data">
        <van-swipe
          v-if="data.data?.banner"
          class="my-swipe"
          :autoplay="3000"
          indicator-color="white"
        >
          <van-swipe-item v-for="(item, index) in data.data?.banner" :key="index">
            <img class="w-screen" :src="axios.defaults.baseURL + '/' + item" alt="banner" />
          </van-swipe-item>
        </van-swipe>
        <img
          v-else
          class="w-full"
          :src="axios.defaults.baseURL + '/' + data.data?.cover"
          alt="cover"
        />
        <div class="m-5">
          <div class="text-2xl font-bold">{{ data.data.name }}</div>
          <div>
            <span class="text-sm text-[#111e36]">价格:</span>
            <span class="text-lg text-[#f60] font-bold ml-1">
              {{ formatNumber(data.data.price) }}
            </span>
          </div>
        </div>
        <div class="ml-5">
          <div class="text-xs text-[#666] flex">
            <div class="w-16">上架时间：</div>
            <div class="break-all">
              {{ moment(data?.data.market_time).format("YYYY年MM月DD日") }}
            </div>
          </div>
          <div class="text-xs text-[#666] flex">
            <div class="w-16">库存：</div>
            <div class="break-all">
              {{ data.data.inventory }}
            </div>
          </div>
          <div class="text-xs text-[#666] flex items-start" v-if="data.data.description">
            <div class="w-16">介绍：</div>
            <div class="break-all flex-1">{{ data.data.description }}</div>
          </div>
        </div>
        <div>
          <div class="font-bold mt-4 mb-2 ml-5 text-sm">标签</div>
          <div class="ml-5">
            <div class="flex text-sm">
              <van-tag
                v-for="(item, index) in data.data.tags"
                :key="index + 'option'"
                :class="index && 'ml-2'"
                type="primary"
                >{{ item }}</van-tag
              >
            </div>
          </div>
        </div>
        <van-action-bar>
          <van-action-bar-icon
            color="red"
            v-if="isCollection?.data"
            icon="star"
            text="已收藏"
            @click="store.userData.id != data?.data?.user_id && unCollection()"
          />
          <van-action-bar-icon
            color="red"
            v-else
            icon="star-o"
            text="收藏"
            @click="store.userData.id != data?.data?.user_id && collection()"
          />
          <van-action-bar-button
            :disabled="store.userData.id == data?.data?.user_id"
            type="warning"
            text="在线沟通"
            @click="router.push(`/client/message/${data?.data?.user_id}`)"
          />
          <van-action-bar-button
            type="danger"
            text="立即购买"
            :disabled="
              !data.data.state ||
              data.data.inventory == 0 ||
              store.userData.id == data?.data?.user_id
            "
            @click="router.push(`/client/order/create?id=${data.data.id}`)"
          />
        </van-action-bar>
      </div>
      <div v-else>
        <van-empty :image="empty" image-size="100" description="未找到对应商品" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watchEffect } from "vue";
import useFetch from "@/hooks/useFetch";
import axios from "axios";
import empty from "@/assets/empty.png";
import moment from "moment";
import { showNotify } from "vant";
import { showSuccessToast, showFailToast } from "vant";
import { useUserData } from "@/store/useUserData";

let store = useUserData();

let route = useRoute();
let router = useRouter();

let { data, isLoading } = useFetch("/commodity/" + route.params.id);
let { data: isCollection } = useFetch("/collection/" + route.params.id);

function collection() {
  axios.post("/collection", { item_id: route.params.id, type: "commodity" }).then(res => {
    if (res.data.success) {
      isCollection.value.data = true;
    } else {
      showNotify({ type: "danger", message: res.data.message });
    }
  });
}

function unCollection() {
  axios.delete(`/collection/${route.params.id}`).then(res => {
    if (res.data.success) {
      isCollection.value.data = false;
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

// 购物车
function addCart() {
  axios.post("/cart", { commodity_id: route.params.id }).then(res => {
    if (res.data.success) {
      showSuccessToast(res.data.message);
    } else {
      showFailToast(res.data.message);
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
