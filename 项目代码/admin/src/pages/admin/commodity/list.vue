<template>
  <el-card>
    <el-select v-model="state" class="m-2" placeholder="选择器商品状态" @change="refetch">
      <el-option label="全部" :value="undefined" />
      <el-option label="停售" :value="0" />
      <el-option label="正常发售" :value="1" />
    </el-select>
  </el-card>
  <el-card class="mt-4">
    <el-input v-model="keyword" class="!w-80" placeholder="搜索" :prefix-icon="Search" />
    <el-table v-if="list" :data="list">
      <el-table-column prop="name" label="名称" width="180" />
      <el-table-column prop="description" label="介绍" width="240" />
      <el-table-column label="封面" width="180">
        <template v-slot="scope">
          <div v-if="!scope.row.cover">无</div>
          <el-image
            v-else
            :zoom-rate="1.2"
            :max-scale="2"
            :min-scale="0.2"
            :preview-src-list="[axios.defaults.baseURL + '/' + scope.row.cover]"
            fit="cover"
            class="w-24"
            :src="axios.defaults.baseURL + '/' + scope.row.cover"
            alt="COVER"
            :hide-on-click-modal="true"
            :preview-teleported="true"
          />
        </template>
      </el-table-column>
      <el-table-column label="发布时间" width="250">
        <template v-slot="scope">
          <el-date-picker v-model="scope.row.create_time" readonly placeholder="发布时间" />
        </template>
      </el-table-column>
      <el-table-column label="当前状态" width="250">
        <template v-slot="scope">
          <el-select
            class="w-32"
            @change="val => selectChange(val, scope.row.id)"
            v-model="scope.row.state"
            placeholder="选择商品状态"
          >
            <el-option :key="0" label="下架" :value="0" />
            <el-option :key="1" label="发售" :value="1" />
          </el-select>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script setup>
import { computed, ref, watchEffect } from "vue";
import useFetch from "@/hooks/useFetch";
import axios from "axios";
import { Edit, Search } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

let router = useRouter();

let state = ref();
let { data } = useFetch("/commodity");
let resData = ref();
let keyword = ref("");
let list = computed(() =>
  (resData.value || data.value?.data || []).filter(item =>
    (item.name + " " + item.id + " " + item.description).includes(keyword.value)
  )
);

function refetch(val) {
  axios.get("/commodity", { params: { state: val } }).then(res => {
    if (res.data.success) {
      resData.value = res.data.data;
    } else {
      ElMessage({
        showClose: true,
        message: "查询失败",
        type: "error",
      });
    }
  });
}

function selectChange(val, id) {
  axios.put(`/commodity/state/${id}`, { state: val }).then(res => {
    if (!res.data.success) {
      ElMessage({
        message: "修改失败",
        type: "error",
      });
    }
  });
}
</script>
<style scoped lang="scss"></style>
