<template>
  <van-nav-bar title="仲裁结果" left-text="返回" left-arrow @click-left="router.back()" />
  <div v-if="isLoading">
    <van-skeleton :row="3" />
    <van-skeleton :row="3" />
    <van-skeleton :row="3" />
  </div>
  <div v-else class="bg-white">
    <div v-if="data?.data" class="px-2 py-1">
      <div
        v-if="
          data?.data.defendant_id == store.userData.id &&
          !isInThreeDays(data?.data?.create_time) &&
          !data?.data?.winner
        "
        class="flex items-center my-1"
      >
        请在<van-count-down :time="setTime(data?.data?.create_time)" class="mx-1">
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
        :key="data?.data?.commodity_data.id + 'commodity'"
        :num="data?.data?.commodity_data.count"
        :price="data?.data?.commodity_data.price"
        :desc="data?.data?.commodity_data.description"
        :title="data?.data?.commodity_data.name"
        :thumb="`${axios.defaults.baseURL}/${data?.data?.commodity_data.cover + ''}`"
        @click="router.push(`/client/commodity/${data?.data?.commodity_data.id}`)"
      />

      <div class="mt-4 text-sm text-gray-500">
        <div>仲裁时间:{{ moment(data?.data?.create_time).format("YYYY-MM-DD hh:mm:ss") }}</div>
        <div class="mt-4">
          <div class="flex items-start">
            发起者说明:
            <div class="break-all">{{ data?.data?.plaintiff_content }}</div>
          </div>
          <div class="flex items-start">
            发起者图片:
            <div class="break-all">
              <div v-if="!data?.data?.reason_pic">无</div>
              <van-image
                v-else
                v-for="(item, index) in data?.data?.reason_pic"
                :key="index + item"
                :class="index && 'ml-1'"
                width="60"
                height="60"
                :src="`${axios.defaults.baseURL}/${item}`"
                @click="preview(data?.data?.reason_pic, index)"
              />
            </div>
          </div>
        </div>
        <div class="mt-4">
          <div class="flex items-start">
            接受者说明:
            <div class="break-all">{{ data?.data?.plaintiff_content }}</div>
          </div>
          <div class="flex items-start">
            接受者图片:
            <div class="break-all">
              <div v-if="!data?.data?.defendant_pic">无</div>
              <van-image
                v-else
                v-for="(item, index) in data?.data?.defendant_pic"
                :key="index + item"
                :class="index && 'ml-1'"
                width="60"
                height="60"
                :src="`${axios.defaults.baseURL}/${item}`"
                @click="preview(data?.data?.reason_pic, index)"
              />
            </div>
          </div>
        </div>
        <div class="mt-4 text-sm text-gray-500 break-all" v-if="data?.data?.note">
          管理员说明:{{ data?.data?.note }}
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex justify-between mt-4">
        <div class="flex text-base">
          <div v-if="!data?.data?.winner" class="text-red-400">
            <van-icon name="warning-o" />
            <span class="ml-1">等待仲裁</span>
          </div>
          <div v-else-if="data?.data?.winner != store.userData.id" class="text-red-400">
            <van-icon name="cross" />
            <span class="ml-1">仲裁失败</span>
          </div>
          <div v-else-if="data?.data?.winner == store.userData.id" class="text-green-400">
            <van-icon name="cross" />
            <span class="ml-1">仲裁成功</span>
          </div>
        </div>
        <div>
          <van-button
            size="small"
            type="danger"
            round
            :disabled="isInThreeDays(data?.data?.create_time)"
            @click="
              router.push(
                `/client/arbitrate/${
                  store.userData.id == data?.data?.defendant_id ? 'update' : 'create'
                }/${data?.data?.order_id}`
              )
            "
          >
            <span v-if="data?.data?.winner">申诉查看</span>
            <span v-else>申诉填写</span>
          </van-button>
        </div>
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
import { showImagePreview } from "vant";

let store = useUserData();
let route = useRoute();
let router = useRouter();

let { data, isLoading } = useFetch("/arbitrate/" + route.params.id);

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

function preview(params, index) {
  showImagePreview({
    images: params.map(item => `${axios.defaults.baseURL}/${item}`),
    closeable: true,
    startPosition: index,
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
