<template>
  <van-nav-bar title="下单" left-text="返回" left-arrow @click-left="router.back()" />
  <!-- 商品信息部分 -->
  <!-- 单个订单 -->
  <div class="mt-4">
    <div v-if="commodityIsLoading" class="animate-pulse bg-gray-200 w-full h-20"></div>
    <div v-else>
      <van-card
        v-if="commodityData.data"
        :price="commodityData.data.price"
        :desc="commodityData.data.description"
        :title="commodityData.data.name"
        :thumb="`${axios.defaults.baseURL}/${commodityData.data.cover}`"
      >
        <template #num>
          <van-stepper v-model="count" :min="1" :max="commodityData.data.inventory" />
        </template>
      </van-card>
      <van-empty v-else :image="empty" image-size="100" description="没有找到对应商品" />
    </div>
  </div>

  <!-- 底部信息 -->
  <van-field
    v-model="notes"
    rows="3"
    autosize
    label="备注"
    type="textarea"
    maxlength="50"
    placeholder="请输入备注"
    show-word-limit
  />
  <van-radio-group icon-size="16" v-model="payment" class="p-2 mt-6">
    <van-radio name="支付宝"
      ><van-icon size="22" name="alipay" color="#00a5e7" />
      <span class="ml-2">支付宝</span></van-radio
    >
    <van-radio size="22" class="mt-2" name="微信支付"
      ><van-icon name="wechat" color="#00db64" /><span class="ml-2">微信支付</span></van-radio
    >
    <van-radio size="22" class="mt-2" name="数字人民币"
      ><van-icon name="card" color="#c02e38" /><span class="ml-2">数字人民币</span></van-radio
    >
  </van-radio-group>
  <van-submit-bar
    placeholder
    :price="price"
    button-text="提交订单"
    tip-icon="info-o"
    @submit="onSubmit"
  />
  <!-- 地址弹窗 -->
</template>
<script setup>
import { ref, watchEffect } from "vue";
import useFetch from "@/hooks/useFetch";
import axios from "axios";
import empty from "@/assets/empty.png";
import { showNotify } from "vant";

let route = useRoute();
let router = useRouter();

let { data: commodityData, isLoading: commodityIsLoading } = useFetch(
  "/commodity/" + route.query.id
);

let price = computed(() => commodityData.value?.data?.price * 100);

let count = ref(1);
let payment = ref("支付宝");
let notes = ref("");
function onSubmit() {
  axios
    .post("/order", {
      payment_method: payment.value,
      commodity_id:commodityData.value.data?.id,
      notes: notes.value,
      count:count.value
    })
    .then(res => {
      if (res.data.success) {
        router.replace("/client/order/success");
      } else {
        showNotify({ type: "warning", message: res.data.message });
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
