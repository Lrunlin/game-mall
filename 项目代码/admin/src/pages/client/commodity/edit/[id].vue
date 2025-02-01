<template>
  <van-nav-bar title="修改商品" left-text="返回" left-arrow @click-left="router.back()" />
  <CommoditForm @onSubmit="submit" :initValue="data?.data" :key="key">
    <van-button
      type="danger"
      block
      round
      class="!w-4/5 !mx-auto !mt-8 !mb-4"
      @click="remove"
      :disabled="data?.data?.state == 0"
    >
      删除商品
    </van-button>
  </CommoditForm>
</template>
<script setup>
import { ref } from "vue";
import CommoditForm from "@/components/user/CommoditForm";
import axios from "axios";
import { showNotify } from "vant";
import useFetch from "@/hooks/useFetch";

let route = useRoute();
let router = useRouter();

let { data, isLoading, refetch } = useFetch("/commodity/" + route.params.id);

let key = ref(+new Date());
function submit(params) {
  axios.put("/commodity/" + route.params.id, params).then(res => {
    if (res.data.success) {
      showNotify({ type: "success", message: res.data.message });
    } else {
      showNotify({ type: "warning", message: res.data.message });
    }
  });
}

function remove() {
  axios.put(`/commodity/state/${route.params.id}`, { state: 0 }).then(res => {
    if (res.data.success) {
      data.value.data.state = 0;
      key.value++;
      showNotify({ type: "success", message: "删除成功" });
    } else {
      showNotify({ type: "warning", message: "删除失败" });
    }
  });
}
</script>
<style scoped lang="scss"></style>
