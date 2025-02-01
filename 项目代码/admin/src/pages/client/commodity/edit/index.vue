<template>
  <van-nav-bar title="发布商品" left-text="返回" left-arrow @click-left="router.back()" />
  <CommoditForm @onSubmit="submit" :key="key" />
</template>
<script setup>
import { ref } from "vue";
import CommoditForm from "@/components/user/CommoditForm";
import axios from "axios";
import { showNotify } from "vant";

let route = useRoute();
let router = useRouter();

let key = ref(+new Date());
function submit(params) {
  axios.post("/commodity", params).then(res => {
    if (res.data.success) {
      showNotify({ type: "success", message: res.data.message });
      key.value++;
    } else {
      showNotify({ type: "warning", message: res.data.message });
    }
  });
}
</script>
<style scoped lang="scss"></style>
