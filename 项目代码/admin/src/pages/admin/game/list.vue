<template>
  <el-card>
    <div v-if="isLoading">
      <el-skeleton :rows="5" />
      <el-skeleton :rows="5" class="mt-4" />
      <el-skeleton :rows="5" class="mt-4" />
    </div>
    <el-table v-else :data="data?.data" style="width: 100%">
      <el-table-column prop="id" label="ID" width="180" />
      <el-table-column prop="name" label="Name" width="180" />
      <el-table-column label="图标" width="180">
        <template v-slot="scope">
          <div>
            <img
              class="w-20 h-20 rounded-md"
              :src="`${axios.defaults.baseURL}/${scope.row.icon}`"
              alt="icon"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="280">
        <template v-slot="scope">
          <div>
            <el-select
              v-model="scope.row.state"
              placeholder="状态选择"
              @change="updateState(scope.row.id, scope.row.state)"
            >
              <el-option label="展示中" :value="1" />
              <el-option label="已删除" :value="0" />
            </el-select>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="280">
        <template v-slot="scope">
          <div>
            <el-date-picker
              v-model="scope.row.create_time"
              type="datetime"
              placeholder="创建时间"
              readonly
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="编辑">
        <template v-slot="scope">
          <div>
            <el-button
              type="primary"
              :icon="Edit"
              circle
              @click="router.push(`/admin/game/${scope.row.id}`)"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script setup>
import { ref } from "vue";
import useFetch from "@/hooks/useFetch";
import axios from "axios";
import { Delete, Edit } from "@element-plus/icons-vue";
let route = useRoute();
let router = useRouter();
let { data, isLoading, refetch } = useFetch(`/game`);

function updateState(id, state) {
  axios.put(`/game/state/${id}`, {state:state}).then(res => {
    if (res.data.success) {
      //   data.value.find(item => item.id == id).state = state;
      //   ElMessage({
      //     message: res.data.message,
      //     type: "success",
      //   });
    } else {
      ElMessage({
        message: res.data.message,
        type: "error",
      });
    }
  });
}

function remove(id) {}
</script>
<style scoped lang="scss"></style>
