<template>
  <div class="flex justify-center flex-wrap mt-24">
    <img src="/logo.svg" alt="logo" class="w-60 max-w-[60%]" />
    <div class="w-full mt-6">
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="username"
            name="email"
            label="邮箱"
            placeholder="邮箱"
            :rules="[
              { required: true, message: '请填写用户邮箱' },
              {
                pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                message: '请填写正确的用户邮箱',
              },
            ]"
          />
          <van-field
            v-model="password"
            type="password"
            name="password"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
        </van-cell-group>
        <div class="mt-8 mx-4">
          <van-button block type="primary" native-type="submit"> 提交 </van-button>
        </div>
      </van-form>
    </div>
    <RouterLink to="/client/sign-up" class="text-gray-400 text-sm mt-9"
      >点击前往注册<van-icon name="arrow"
    /></RouterLink>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { showNotify } from "vant";
import axios from "axios";
import { useUserData } from "@/store/useUserData";
import cookie from "js-cookie";

let useUser = useUserData();

let router = useRouter();

let username = ref("");
let password = ref("");

function onSubmit(values) {
  axios
    .post("/user/sign", values)
    .then(res => {
      if (res.data.success) {
        showNotify({ type: "success", message: "登录成功" });
        localStorage.token = res.data.token;
        cookie.set("token", res.data.token);
        useUser.set(res.data.data);
        router.replace("/client");
      } else {
        showNotify({ type: "danger", message: "登录失败" });
      }
    })
    .catch(err => {
      showNotify({ type: "danger", message: "登录失败" });
    });
}
</script>
<style scoped lang="scss"></style>
