<template>
  <van-nav-bar title="客服介入" left-text="返回" left-arrow @click-left="router.back()" />
  <van-card
    v-if="data?.data"
    :num="data?.data?.commodity_data.count"
    :price="data?.data?.commodity_data.price"
    :desc="data?.data?.commodity_data.description"
    :title="data?.data?.commodity_data.name"
    :thumb="`${axios.defaults.baseURL}/${data?.data?.commodity_data.cover}`"
  />
  <van-field
    v-model="plaintiff_content"
    :disabled="!!dataArbitrate?.data?.length"
    rows="5"
    autosize
    label="申诉内容"
    type="textarea"
    maxlength="300"
    placeholder="请输入申诉内容"
    show-word-limit
  />
  <van-field name="uploader" label="说明图上传">
    <template #input>
      <VantUpload
        :max="6"
        :initValue="reason_pic_init"
        @onSubmit="val => (reason_pic = val)"
        :disabled="dataArbitrate?.data?.length"
      />
    </template>
  </van-field>
  <van-button
    @click="submit"
    type="primary"
    block
    round
    class="!w-3/6 !mx-auto !mb-8 !mt-4"
    :disabled="!!dataArbitrate?.data"
    >提交</van-button
  >
  <div class="mt-6 text-center text-sm text-gray-400">注意:提交后无法修改</div>
</template>
<script setup>
import { ref } from "vue";
import { useUserData } from "@/store/useUserData";
import { watchEffect } from "vue";
import axios from "axios";
import { showNotify, showSuccessToast, showFailToast } from "vant";
import VantUpload from "@/components/VantUpload";
import useFetch from "@/hooks/useFetch";
let store = useUserData();
let route = useRoute();
let router = useRouter();

let { data, isLoading } = useFetch("/order/" + route.params.id);
let { data: dataArbitrate, refetch } = useFetch("/arbitrate/" + route.params.id);

let reason_pic = ref([]);
let reason_pic_init = ref(null);
let plaintiff_content = ref("");

let stop = watchEffect(() => {
  if (dataArbitrate.value?.data?.id) {
    plaintiff_content.value = dataArbitrate.value?.data.plaintiff_content;
    reason_pic.value = dataArbitrate.value?.data.reason_pic;
    reason_pic_init.value = dataArbitrate.value?.data.reason_pic;
    setTimeout(() => {
      stop();
    }, 0);
  }
});

function submit() {
  if (!/^[\s\S]*.*[^\s][\s\S]*$/.test(plaintiff_content.value)) {
    showNotify({ type: "warning", message: "请填写申诉内容" });
    return;
  }

  axios
    .post("/arbitrate", {
      order_id: route.params.id,
      plaintiff_content: plaintiff_content.value,
      reason_pic: reason_pic.value,
    })
    .then(res => {
      if (res.data.success) {
        refetch();
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
