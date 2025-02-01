<template>
  <div class="flex justify-center flex-wrap mt-24">
    <img src="/logo.svg" alt="logo" class="w-60 max-w-[60%]" />
    <div class="w-full mt-6">
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="name"
            name="name"
            label="用户名"
            placeholder="用户名"
            maxlength="8"
            :rules="[{ required: true, message: '请填写用户名' }]"
          />
          <van-field
            v-model="email"
            name="email"
            label="邮箱"
            placeholder="邮箱"
            :rules="[
              { required: true, message: '请填写邮箱' },
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
          <van-field
            v-model="confirmPassword"
            type="password"
            label="确认密码"
            placeholder="确认密码"
            :rules="[{ validator: validatePasswordConfirm, message: '两次密码不一致' }]"
          />
          <van-field
            v-model="avatar"
            type="avatar"
            label="头像"
            :rules="[{ required: true, message: '请上传头像' }]"
          >
            <template #input>
              <VantUpload @onSubmit="val => (avatar = val[0])" />
            </template>
          </van-field>
        </van-cell-group>
        <div class="mt-8 mx-4">
          <van-button block type="primary" native-type="submit"> 提交 </van-button>
        </div>
      </van-form>
    </div>
    <RouterLink to="/client/sign" class="text-gray-400 text-sm mt-9"
      >去登录<van-icon name="arrow"
    /></RouterLink>
  </div>
</template>
<script setup>
import { ref } from "vue";
import axios from "axios";
import { showNotify } from "vant";
import VantUpload from "@/components/VantUpload";
let router = useRouter();

let name = ref("");
let email = ref("");
let password = ref("");
let confirmPassword = ref("");
let avatar = ref("");

const validatePasswordConfirm = value => value == password.value;
function onSubmit(values) {
  axios
    .post("/user", { ...values, avatar: avatar.value })
    .then(res => {
      if (res.data.success) {
        showNotify({
          type: "success",
          message: res.data.message,
          onClose() {
            router.replace("/client/sign");
          },
        });
      } else {
        showNotify({ type: "danger", message: res.data.message });
      }
    })
    .catch(err => {
      showNotify({ type: "danger", message: "注册失败" });
    });
}
</script>
<style scoped lang="scss"></style>
