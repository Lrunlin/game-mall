<template>
  <el-card>
    <el-table v-if="data?.data" :data="data.data" style="width: 100%">
      <el-table-column prop="title" label="标题" width="220" />
      <el-table-column label="对应商品" width="250">
        <template v-slot="{ row }">
          <div v-if="row.commodity_data">
            <div>
              <img
                class="w-40"
                :src="axios.defaults.baseURL + '/' + row.commodity_data.cover"
                alt="COVER"
              />
            </div>
            <div>{{ row.commodity_data.name }}</div>
          </div>
          <div v-else>无</div>
        </template>
      </el-table-column>
      <el-table-column label="封面图片" width="320">
        <template v-slot="{ row }">
          <div v-if="row.cover.length">
            <el-image
              v-for="(item, index) in row.cover"
              :key="index"
              :zoom-rate="1.2"
              :max-scale="2"
              :min-scale="0.2"
              :preview-src-list="[axios.defaults.baseURL + '/' + item]"
              fit="cover"
              class="w-16"
              :class="index && 'ml-3'"
              :src="axios.defaults.baseURL + '/' + item"
              alt="COVER"
              :hide-on-click-modal="true"
              :preview-teleported="true"
            />
          </div>
          <div v-else>无</div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button type="primary" :icon="Edit" @click="router.push(`/admin/article/${row.id}`)"
            >编辑</el-button
          >
          <el-button type="danger" :icon="Delete" @click="remove(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script setup>
import { ref } from "vue";
import useFetch from "@/hooks/useFetch";
import { useUserData } from "@/store/useUserData";
import axios from "axios";
import { Delete, Edit } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

let store = useUserData();
let router = useRouter();
let { data, refetch } = useFetch(`/article`);
function remove(id) {
  axios.delete(`/article/${id}`).then(res => {
    if (res.data.success) {
      refetch();
      ElMessage.success(res.data.message);
    } else {
      ElMessage.error(res.data.message);
    }
  });
}
</script>
<style scoped lang="scss"></style>
