<template>
  <van-nav-bar title="我的订单" left-text="返回" left-arrow @click-left="router.back()" />
  <div v-if="isLoading">
    <van-skeleton :row="3" />
    <van-skeleton :row="3" />
    <van-skeleton :row="3" />
  </div>
  <div v-else>
    <div
      v-if="data?.data.length"
      class="px-2 py-1 border-0 border-b border-gray-200 border-solid"
      v-for="(item, index) in data?.data"
      :key="item.id"
    >
      <van-card
        :key="item.commodity_data.id + 'commodity' + index"
        :num="item.commodity_data.count"
        :price="item.commodity_data.price"
        :desc="item.commodity_data.description"
        :title="item.commodity_data.name"
        :thumb="`${axios.defaults.baseURL}/${item.commodity_data.cover + ''}`"
        @click="router.push(`/client/commodity/${item.commodity_data.id}`)"
      />

      <!-- 操作按钮 -->
      <div class="flex justify-between mt-4">
        <div class="flex text-base">
          <div v-if="item.state == 1" class="text-green-400">
            <van-icon name="success" />
            <span class="ml-1">已完成</span>
          </div>
          <div v-if="item.state == 2" class="text-red-400">
            <van-icon name="warning-o" />
            <span class="ml-1">仲裁中</span>
          </div>
          <div v-if="item.state == 0" class="text-blue-400">
            <van-icon name="clock-o" />
            <span class="ml-1">等待收货</span>
          </div>
        </div>
        <div>
          <van-button
            size="small"
            type="primary"
            round
            class="!mr-2"
            :disabled="item.state == 1"
            @click="router.push(`/client/arbitrate/create/${item.id}`)"
            >客服介入</van-button
          >
          <van-button
            size="small"
            type="danger"
            round
            :disabled="item.state != 0"
            @click="finish(item.id)"
            >确认收货</van-button
          >
        </div>
      </div>
      <!-- 订单信息 -->
      <div class="ml-4 mt-4 text-sm text-gray-500">
        <div>订单号:{{ item.id }}</div>
        <div>支付凭证:{{ item.payment_method }}</div>
        <div v-if="item.notes">订单备注:{{ item.notes }}</div>
        <div>下单时间:{{ moment(item.create_time).format("YYYY-MM-DD hh:mm:ss") }}</div>
      </div>
    </div>
    <van-empty v-else :image="empty" image-size="100" description="暂时没有订单哦" />
  </div>

  <van-back-top />
</template>
<script setup>
import { ref } from "vue";
import useFetch from "@/hooks/useFetch";
import empty from "@/assets/empty.png";
import axios from "axios";
import moment from "moment";
import { showSuccessToast, showFailToast } from "vant";
import { showNotify } from "vant";
import { showConfirmDialog } from "vant";
let router = useRouter();

let { data, isLoading, refetch } = useFetch("/order", { params: { user: true } });

function finish(id) {
  showConfirmDialog({
    title: "确定收货",
    message: "请在商品确认无误后收货，确认收货后不在接受客服介入",
  })
    .then(() => {
      axios.put(`/order/state/${id}`, { state: 1 }).then(res => {
        if (res.data.success) {
          refetch();
          showSuccessToast(res.data.message);
        } else {
          showFailToast(res.data.message);
        }
      });
    })
    .catch(() => {});
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
