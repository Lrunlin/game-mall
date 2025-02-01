<template>
  <el-card>
    <div v-if="isLoading">
      <el-skeleton :rows="5" />
      <el-skeleton :rows="5" />
      <el-skeleton :rows="5" />
    </div>
    <el-descriptions title="数据分析" direction="vertical" :column="4" border>
      <el-descriptions-item label="用户数量">
        <count-up v-if="!isLoading && data?.data" :end-val="data?.data.totalUsers"></count-up>
      </el-descriptions-item>
      <el-descriptions-item label="文章数量">
        <count-up v-if="!isLoading && data?.data" :end-val="data?.data.totalArticle"></count-up
      ></el-descriptions-item>
      <el-descriptions-item label="订单数量">
        <count-up v-if="!isLoading && data?.data" :end-val="data?.data.totalOrders"></count-up
      ></el-descriptions-item>
      <el-descriptions-item label="商品数量">
        <count-up v-if="!isLoading && data?.data" :end-val="data?.data.totalCommodity"></count-up
      ></el-descriptions-item>
      <el-descriptions-item label="订单趋势">
        <div id="orderDate" style="width: 100%; height: 400px"></div
      ></el-descriptions-item>
    </el-descriptions>
  </el-card>
</template>
<script setup>
import { ref, watchEffect, onMounted } from "vue";
import moment from "moment";
// import * as echarts from "echarts";
import * as echarts from "echarts/core";
import { GridComponent } from "echarts/components";
import { LineChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import useFetch from "@/hooks/useFetch";
import CountUp from "vue-countup-v3";
echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition]);
let { data, isLoading } = useFetch("/statistics");

watchEffect(() => {
  if (!isLoading.value && data.value?.data) {
    let list = data.value?.data.ordersLast7Days;
    let myChart = echarts.init(document.getElementById("orderDate"));
    let option = {
      xAxis: {
        type: "category",
        data: list.map(item => moment(item.orderDate).format("YYYY-MM-DD")),
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: list.map(item => item.orderCount),
          type: "line",
          smooth: true,
        },
      ],
    };
    option && myChart.setOption(option);
  }
});
</script>
<style scoped lang="scss"></style>
<route lang="json"></route>
