<template>
  <van-nav-bar title="仲裁列表" left-text="返回" left-arrow @click-left="router.back()" />
  <div v-if="isLoading">
    <van-skeleton :row="3" />
    <van-skeleton :row="3" />
    <van-skeleton :row="3" />
  </div>
  <div v-else class="bg-white">
    <div
      v-if="data?.data.length"
      class="px-2 py-1 border-0 border-b border-gray-200 border-solid"
      v-for="(item, index) in data?.data"
      :key="item.id"
    >
      <div
        v-if="item.defendant_id == store?.userData?.id && !isInThreeDays(item.create_time)"
        class="flex items-center my-1"
      >
        请在<van-count-down :time="setTime(item.create_time)" class="mx-1">
          <template #default="timeData">
            <div>
              <span v-if="timeData.days">{{ timeData.days }}天</span>
              <span>{{ timeData.hours }}小时</span>
              <span>{{ timeData.minutes }}分</span>
              <span>{{ timeData.seconds }}秒</span>
            </div>
          </template> </van-count-down
        >内填写说明
      </div>
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
          <div v-if="!item.winner" class="text-red-400">
            <van-icon name="warning-o" />
            <span class="ml-1">等待仲裁</span>
          </div>
          <div v-else class="text-blue-400">
            <van-icon name="passed" />
            <span class="ml-1">仲裁结束</span>
          </div>
        </div>
        <div>
          <van-button
            class="!mr-4"
            size="small"
            type="primary"
            round
            :disabled="!item.winner"
            @click="router.push(`/client/arbitrate/${item.order_id}`)"
          >
            查询结果
          </van-button>

          <van-button
            size="small"
            type="danger"
            round
            :disabled="isInThreeDays(item.create_time)"
            @click="
              router.push(
                `/client/arbitrate/${
                  store.userData.id == item.defendant_id ? 'update' : 'create'
                }/${item.order_id}`
              )
            "
          >
            申诉填写
          </van-button>
        </div>
      </div>
      <!-- 订单信息 -->
      <div class="ml-4 mt-4 text-sm text-gray-500">
        <div>仲裁时间:{{ moment(item.create_time).format("YYYY-MM-DD hh:mm:ss") }}</div>
      </div>
    </div>
    <van-empty v-else :image="empty" image-size="100" description="暂时没有仲裁哦" />
  </div>
</template>
<script setup>
import { ref } from "vue";
import useFetch from "@/hooks/useFetch";
import axios from "axios";
import { computed } from "vue";
import { useUserData } from "@/store/useUserData";
import moment from "moment";

let { data, isLoading } = useFetch("/arbitrate/list/user");
let store = useUserData();
let route = useRoute();
let router = useRouter();
let search = ref("");

function setTime(t) {
  const time = moment(t);
  const threeDaysLater = time.clone().add(3, "days");
  const diffMilliseconds = threeDaysLater.diff(time);
  return diffMilliseconds;
}

// 是否超过三天
function isInThreeDays(time) {
  return +new Date() > +new Date(time) + 24 * 60 * 60 * 1000 * 3;
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
