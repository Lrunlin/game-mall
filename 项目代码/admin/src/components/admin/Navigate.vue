<template>
  <el-menu
    active-text-color="#ffd04b"
    background-color="#545c64"
    class="w-52 min-h-screen"
    default-active="2"
    text-color="#fff"
    router
  >
    <el-menu-item index="/admin"
      ><el-icon><HomeFilled /></el-icon>首页</el-menu-item
    >
    <el-sub-menu index="4">
      <template #title>
        <el-icon><TrophyBase /></el-icon>
        游戏管理
      </template>
      <el-menu-item index="/admin/game/list">游戏列表</el-menu-item>
      <el-menu-item index="/admin/game/create">游戏添加</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="2">
      <template #title>
        <el-icon><Shop /></el-icon>
        商品管理
      </template>
      <el-menu-item index="/admin/commodity/list">商品列表</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="1">
      <template #title>
        <el-icon><Notebook /></el-icon>
        文章管理
      </template>
      <el-menu-item index="/admin/article/list">文章列表</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="/admin/banner"
      ><el-icon><Postcard /></el-icon>轮播</el-menu-item
    >
    <el-menu-item index="/admin/user"
      ><el-icon><User /></el-icon>用户信息查看</el-menu-item
    >
    <el-menu-item index="/admin/arbitrate"
      ><el-icon><List /></el-icon>仲裁管理</el-menu-item
    >
    <el-menu-item index="/admin/order"
      ><el-icon><Dish /></el-icon>订单列表</el-menu-item
    >
    <el-sub-menu index="3">
      <template #title>
        <el-icon><Message /></el-icon>
        公告管理
      </template>
      <el-menu-item index="/admin/notice">公告列表</el-menu-item>
      <el-menu-item index="/admin/notice/create">公告发布</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="/admin/password"
      ><el-icon><Setting /></el-icon>密码修改</el-menu-item
    >
    <el-menu-item index="/admin/sign"
      ><el-icon><Fold /></el-icon>退出登录</el-menu-item
    >
  </el-menu>
</template>
<script setup>
import { ref } from "vue";
import {
  TrophyBase,
  ShoppingBag,
  User,
  Dish,
  Setting,
  Fold,
  Shop,
  Edit,
  Notebook,
  HomeFilled,
  Message,
  Postcard,
  List,
} from "@element-plus/icons-vue";
</script>
<style scoped lang="scss"></style>
