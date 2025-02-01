<template>
  <div class="">
    <RouterView />
  </div>
  <!-- <div class="fixed bottom-0 left-0 z-20 bg-white"> -->
    <Navigate />
  <!-- </div> -->
</template>
<script setup>
import Navigate from "@/components/user/Navigate";
import { watchEffect } from "vue";
import { useUserData } from "@/store/useUserData";
import { useRouter } from "vue-router";
import axios from "axios";

let store = useUserData();
let router = useRouter();

onMounted(() => {
  document.body.classList.add("bg-gray-100");
});

onUnmounted(() => {
  document.body.classList.remove("bg-gray-100");
});

watchEffect(() => {
  if (store.userData == false) {
    router.replace("/client/sign");
  }
});

if (!store.userData) {
  axios
    .get("/user/info")
    .then(res => {
      if (res.data.success) {
        store.set(res.data.data);
      } else {
        store.set(false);
      }
    })
    .catch(err => {
      store.set(false);
    });
}

// onMounted(() => {
//   document.body.classList.add("pl-52");
// });
// onUnmounted(() => {
//   document.body.classList.remove("pl-52");
// });
</script>
