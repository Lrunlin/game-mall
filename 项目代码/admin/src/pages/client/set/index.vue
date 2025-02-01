<template>
  <van-nav-bar title="我的" left-text="返回" left-arrow @click-left="router.back()" />
  <div v-if="isLoading">
    <van-skeleton title :row="3" />
    <van-skeleton title :row="3" />
    <van-skeleton title :row="3" />
  </div>
  <van-form @submit="onSubmit" v-else>
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
          <VantUpload :initValue="[avatar]" @onSubmit="val => (avatar = val[0])" />
        </template>
      </van-field>
    </van-cell-group>
    <div class="mt-8 mx-4">
      <van-button block type="primary" native-type="submit"> 提交 </van-button>
    </div>
  </van-form>
</template>
<script setup>
import { ref } from "vue";
import { useUserData } from "@/store/useUserData";
import { watchEffect } from "vue";
import axios from "axios";
import { showNotify } from "vant";
import VantUpload from "@/components/VantUpload";
import useFetch from "@/hooks/useFetch";
let { data, isLoading } = useFetch("/user");

let store = useUserData();
let router = useRouter();

let name = ref("");
let email = ref("");
let password = ref("");
let confirmPassword = ref("");
let avatar = ref("");

let stop = watchEffect(() => {
  if (data.value?.data) {
    stop();
    let item = data.value?.data;
    name.value = item.name;
    email.value = item.email;
    avatar.value = item.avatar;
  }
});

const validatePasswordConfirm = value => value == password.value;
function onSubmit(values) {
  axios
    .put("/user", { ...values, avatar: avatar.value })
    .then(res => {
      if (res.data.success) {
        showNotify({ type: "success", message: res.data.message });
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
<route lang="json">
{
  "meta": {
    "layout": "client-empty"
  }
}
</route>
