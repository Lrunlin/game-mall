<template>
  <van-tabbar route :placeholder="true" fixed>
    <van-tabbar-item to="/client" icon="home-o">首页</van-tabbar-item>
    <van-tabbar-item to="/client/community" icon="friends-o">社区</van-tabbar-item>
    <van-tabbar-item to="/client/commodity/edit" icon="add-o">发布</van-tabbar-item>
    <van-tabbar-item to="/client/message" icon="chat-o">消息</van-tabbar-item>
    <van-tabbar-item to="/client/user" icon="user-o">用户</van-tabbar-item>
  </van-tabbar>
</template>
<script setup>
import { ref } from "vue";
</script>
<style scoped lang="scss"></style>
