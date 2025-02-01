<template>
  <RouterView />
</template>
<script setup>
import { watchEffect } from "vue";
import { useUserData } from "@/store/useUserData";
import { useRouter } from "vue-router";
import axios from "axios";

let store = useUserData();
let router = useRouter();

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
</script>
