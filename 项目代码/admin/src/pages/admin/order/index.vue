<template>
  <el-card>
    <el-input v-model="search" placeholder="输入订单号" class="!w-80" />
    <el-button type="primary" class="ml-4" @click="searchData(search)">查询</el-button>
  </el-card>
  <el-card class="mt-4">
    <div v-if="isLoading">
      <el-skeleton :rows="5" />
      <el-skeleton class="mt-4" :rows="5" />
    </div>
    <el-table v-else :data="data" style="width: 100%">
      <el-table-column type="expand">
        <template v-slot="socpe">
          <el-descriptions direction="vertical" :column="4" border>
            <el-descriptions-item label="商品ID">
              <span>
                {{ socpe.row.commodity_data.id }}
              </span>
            </el-descriptions-item>
            <el-descriptions-item label="商品名称">{{
              socpe.row.commodity_data.name
            }}</el-descriptions-item>
            <el-descriptions-item label="商品价格"
              >价格:{{ socpe.row.commodity_data.price }}</el-descriptions-item
            >
            <el-descriptions-item label="商品图片" :span="2">
              <div class="cursor-pointer w-16 truncate ml-8">
                <img
                  class="w-14 rounded-full"
                  :src="`${axios.defaults.baseURL}/${socpe.row.commodity_data.cover}`"
                  alt="avatar"
                />
              </div>
            </el-descriptions-item>
          </el-descriptions>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="订单号" width="130" />
      <el-table-column label="用户" width="130">
        <template v-slot="socpe">
          <div class="text-center">
            <img
              class="w-12 rounded-full"
              :src="`${axios.defaults.baseURL}/${socpe.row.user_avatar}`"
              alt="avatar"
            />
            <div class="mt-2">{{ socpe.row.user_name }}</div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="80">
        <template v-slot="socpe">
          <el-tag type="success" v-if="socpe.row.state == 1">已完成</el-tag>
          <el-tag type="error" v-else-if="socpe.row.state == 2">仲裁中</el-tag>
          <el-tag type="primary" v-else>进行中</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="支付凭证" width="190">
        <template v-slot="socpe">
          <div class="truncate">{{ socpe.row.payment_method }}</div>
        </template>
      </el-table-column>
      <el-table-column label="订单备注" width="190">
        <template v-slot="socpe">
          <div class="truncate">{{ socpe.row.notes }}</div>
        </template>
      </el-table-column>
      <el-table-column label="下单时间">
        <template v-slot="socpe">
          <el-date-picker v-model="socpe.row.create_time" type="datetime" readonly />
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script setup>
import axios from "axios";
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

let router = useRouter();

let search = ref("");

let isLoading = ref(false);
let data = ref([]);
function searchData(id) {
  isLoading.value = true;
  axios
    .get("/order", { params: { id: id ? +id : undefined } })
    .then(res => {
      if (res.data.success) {
        data.value = res.data.data;
      } else {
        ElMessage.error(`查询失败`);
      }
    })
    .finally(() => {
      isLoading.value = false;
    });
}
searchData();

function formatProductCount(count) {
  if (count >= 10000) {
    const num = Math.floor(count / 10000);
    return `${num}万+`;
  } else if (count >= 1000) {
    const num = Math.floor(count / 1000);
    return `${num}000+`;
  } else if (count >= 100) {
    const num = Math.floor(count / 100);
    return `${num}00+`;
  } else {
    return `${count}`;
  }
}
</script>
<style scoped lang="scss"></style>
