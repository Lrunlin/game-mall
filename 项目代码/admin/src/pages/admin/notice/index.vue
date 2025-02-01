<template>
  <el-card>
    <div v-if="isLoading"><el-skeleton :rows="5" /> <el-skeleton :rows="5" class="mt-4" /></div>
    <el-table v-else :data="data?.data || []" style="width: 100%">
      <el-table-column label="标题" width="200">
        <template #default="socpe">
          <el-popover placement="top-start" :width="200" trigger="hover" :content="socpe.row.title">
            <template #reference>
              <div class="truncate">
                {{ socpe.row.title }}
              </div>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="内容" width="260">
        <template #default="socpe">
          <el-popover placement="top-start" :width="400" trigger="hover" :content="socpe.row.title">
            <template #reference>
              <div v-html="socpe.row.content"></div>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" width="260">
        <template #default="socpe">
          <el-date-picker
            v-model="socpe.row.create_time"
            readonly
            type="datetime"
            placeholder="Select date and time"
          />
        </template>
      </el-table-column>
      <el-table-column label="是否置顶" width="260">
        <template #default="socpe">
          <div class="font-bold">
            <div class="text-red-700" v-if="socpe.row.isTop">是</div>
            <div class="text-blue-700" v-else>否</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="删除">
        <template #default="socpe">
          <el-button type="danger" :icon="Delete" circle @click="remove(socpe.row.id)" />
        </template>
      </el-table-column>
      <el-table-column type="expand">
        <template #default="socpe">
          <div class="flex cursor-pointer flex-wrap mt-2" v-if="socpe.row.target.length">
            <div
              @click="router.push(`/admin/store/${item.id}`)"
              v-for="(item, index) in socpe.row.store_list"
              :key="item.id"
            >
              <div>
                <img
                  class="w-12 rounded-sm"
                  :src="`${axios.defaults.baseURL}/${item.cover_pic}`"
                  alt="cover"
                />
              </div>
              <div class="font-bold mt-2">{{ item.name }}</div>
            </div>
          </div>
          <div v-else>全部经销商</div>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script setup>
import { ref } from "vue";
import useFetch from "@/hooks/useFetch";
import axios from "axios";
import { ElMessage } from "element-plus";
import { Delete } from "@element-plus/icons-vue";

let { data, isLoading } = useFetch("/notice");

let router = useRouter();

function remove(id) {
  axios
    .delete(`/notice/${id}`)
    .then(res => {
      console.log(res.data);
      if (res.data.success) {
        ElMessage.success("公告删除成功");
        data.value.data = data.value.data.filter(notice => notice.id != id);
      } else {
        ElMessage.error("公告删除失败");
      }
    })
    .catch(error => {
      ElMessage.error("公告删除失败，网络错误");
      console.error(error);
    });
}
</script>
<style scoped lang="scss"></style>
