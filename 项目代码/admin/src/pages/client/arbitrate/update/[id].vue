<template>
  <van-nav-bar title="客服介入" left-text="返回" left-arrow @click-left="router.back()" />
  <van-card
    v-if="data?.data"
    :num="data?.data?.commodity_data.count"
    :price="data?.data?.commodity_data.price"
    :desc="data?.data?.commodity_data.description"
    :title="data?.data?.commodity_data.name"
    :thumb="`${axios.defaults.baseURL}/${data?.data?.commodity_data.cover}`"
    :disabled="disabled"
  />
  <van-field
    v-model="defendant_content"
    rows="5"
    autosize
    label="证据说明"
    type="textarea"
    maxlength="300"
    placeholder="请输入证据说明"
    show-word-limit
  />
  <van-field name="uploader" label="说明图上传">
    <template #input>
      <VantUpload
        :max="6"
        :initValue="defendant_pic_init"
        @onSubmit="val => (defendant_pic = val)"
        :disabled="disabled"
      />
    </template>
  </van-field>
  <van-button
    @click="submit"
    type="primary"
    block
    round
    class="!w-3/6 !mx-auto !mb-8 !mt-4"
    :disabled="disabled"
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

let defendant_pic = ref([]);
let defendant_pic_init = ref(null);
let defendant_content = ref("");
let disabled = ref(false);

let stop = watchEffect(() => {
  if (dataArbitrate.value?.data?.id) {
    defendant_content.value = dataArbitrate.value?.data.defendant_content;
    console.log(defendant_content.value);
    if (defendant_content.value?.length) disabled.value = true;
    if (dataArbitrate.value?.data.winner) disabled.value = true;
    if (isInThreeDays(dataArbitrate.value?.data.create_time)) disabled.value = true;
    defendant_pic.value = dataArbitrate.value?.data.defendant_pic;
    defendant_pic_init.value = dataArbitrate.value?.data.defendant_pic;
    setTimeout(() => {
      stop();
    }, 0);
  }
});

function submit() {
  if (!/^[\s\S]*.*[^\s][\s\S]*$/.test(defendant_content.value)) {
    showNotify({ type: "warning", message: "请填写申诉内容" });
    return;
  }

  axios
    .put("/arbitrate/defendant/" + route.params.id, {
      defendant_content: defendant_content.value,
      defendant_pic: defendant_pic.value,
    })
    .then(res => {
      if (res.data.success) {
        refetch();
        showSuccessToast(res.data.message);
        disabled.value = true;
      } else {
        showFailToast(res.data.message);
      }
    });
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
