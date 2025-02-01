<template>
  <el-card>
    <el-button
      type="primary"
      @click="
        () => {
          key = Math.random() + '' + +new Date();
          initValue = null;
          dialogTableVisible = true;
        }
      "
      >添加</el-button
    >
  </el-card>
  <el-card class="mt-4">
    <el-table v-if="data?.success" :data="data.data">
      <el-table-column label="链接" width="300">
        <template v-slot="scope">
          <div v-if="scope.row.url">
            <a target="_blank" :href="scope.row.url">{{ scope.row.url }}</a>
          </div>
          <div v-else>无</div>
        </template>
      </el-table-column>
      <el-table-column label="图片">
        <template v-slot="scope">
          <el-image
            :hide-on-click-modal="true"
            :preview-teleported="true"
            class="max-w-xs"
            :src="axios.defaults.baseURL + '/' + scope.row.cover"
            :zoom-rate="1.2"
            :max-scale="7"
            :min-scale="0.2"
            :preview-src-list="[axios.defaults.baseURL + '/' + scope.row.cover]"
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template v-slot="scope">
          <el-date-picker v-model="scope.row.create_time" readonly type="datetime" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template v-slot="scope">
          <el-button type="primary" :icon="Edit" @click="edit(scope.row)">编辑</el-button>
          <el-button type="danger" :icon="Delete" @click="remove(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <BannerDialog
    :key="key"
    :initValue="initValue"
    v-model:dialogTableVisible="dialogTableVisible"
    @onSubmit="onSubmit"
  />
</template>
<script setup>
import { ref } from "vue";
import BannerDialog from "@/components/admin/BannerDialog";
import axios from "axios";
import { ElMessage } from "element-plus";
import useFetch from "@/hooks/useFetch";
import { Delete, Edit } from "@element-plus/icons-vue";

let { data, refetch } = useFetch("/banner");

let dialogTableVisible = ref(false);
let initValue = ref(null);
let key = ref(Math.random()); //为init为null时子组件不会进行赋值，所以强制刷新key

function edit(params) {
  dialogTableVisible.value = true;
  initValue.value = JSON.parse(JSON.stringify(params));
}
function remove(id) {
  axios.delete("/banner/" + id).then(res => {
    if (res.data.success) {
      refetch();
      ElMessage.success("删除成功");
    } else {
      ElMessage.error("删除失败");
    }
  });
}

function onSubmit(params) {
  if (initValue.value) {
    axios.put("/banner/" + initValue.value.id, params).then(res => {
      if (res.data.success) {
        refetch();
        ElMessage.success("修改成功");
        dialogTableVisible.value = false;
      } else {
        ElMessage.error("修改失败");
      }
    });
  } else {
    axios.post("/banner", params).then(res => {
      if (res.data.success) {
        refetch();
        ElMessage.success("添加成功");
        dialogTableVisible.value = false;
      } else {
        ElMessage.error("添加失败");
      }
    });
  }
}
</script>
<style scoped lang="scss"></style>
