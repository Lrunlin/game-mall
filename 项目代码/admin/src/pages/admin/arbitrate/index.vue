<template>
  <el-card>
    <div v-if="isLoading">
      <el-skeleton :rows="5" />
      <el-skeleton :rows="5" class="mt-4" />
    </div>
    <el-table v-if="data?.data" :data="data?.data" style="width: 100%">
      <el-table-column label="用户信息" width="180">
        <template v-slot="socpe">
          <div class="flex">
            <div class="text-center">
              <div class="text-sm text-gray-700 mb-2">发起者</div>
              <img
                class="w-12 h-12"
                :src="`${axios.defaults.baseURL}/${socpe.row.plaintiff_avatar}`"
                alt="cover"
              />
              <div class="truncate">{{ socpe.row.plaintiff_name }}</div>
            </div>
            <div class="ml-4 text-center">
              <div class="text-sm text-gray-700 mb-2">接收者</div>
              <img
                class="w-12 h-12"
                :src="`${axios.defaults.baseURL}/${socpe.row.defendant_avatar}`"
                alt="cover"
              />
              <div class="truncate">{{ socpe.row.defendant_name }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="商品" width="200">
        <template v-slot="socpe">
          <div>
            <img
              class="w-12 h-12"
              :src="`${axios.defaults.baseURL}/${socpe.row.commodity_data.cover}`"
              alt="cover"
            />
            <div class="truncate">{{ socpe.row.commodity_data.name }}</div>
            <div>{{ socpe.row.commodity_data.price }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="结果" width="180">
        <template v-slot="socpe">
          <span v-if="socpe.row.winner">
            <span>{{ socpe.row.plaintiff_id == socpe.row.winner ? "发起者" : "接收者" }}:</span>
            <span>{{ socpe.row.winner }}</span>
          </span>
          <span v-else>暂无结果</span>
        </template>
      </el-table-column>
      <el-table-column label="商品" width="200">
        <template v-slot="socpe">
          <div>
            <img
              class="w-12 h-12"
              :src="`${axios.defaults.baseURL}/${socpe.row.commodity_data.cover}`"
              alt="cover"
            />
            <div class="truncate">{{ socpe.row.commodity_data.name }}</div>
            <div>{{ socpe.row.commodity_data.price }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="发起时间" width="260">
        <template v-slot="socpe">
          <el-date-picker
            v-model="socpe.row.create_time"
            readonly
            type="datetime"
            placeholder="Select date and time"
          />
        </template>
      </el-table-column>
      <el-table-column label="截止时间" width="260">
        <template v-slot="socpe">
          <div v-if="isInThreeDays(socpe.row.create_time)">时间截止</div>
          <div v-else>
            {{ timeToThreeDaysLater(socpe.row.create_time) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="socpe">
          <el-button type="primary" @click="activeData = socpe.row">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <el-dialog v-model="show" width="700" @close="close" destroy-on-close>
    <el-tabs v-model="activeName" v-if="activeData">
      <el-tab-pane label="查看" name="first">
        <el-descriptions direction="vertical" :column="4" border>
          <el-descriptions-item label="商品信息">
            <div>
              <el-image
                style="width: 100px; height: 100px"
                :src="`${axios.defaults.baseURL}/${activeData.commodity_data.cover}`"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                :preview-src-list="[`${axios.defaults.baseURL}/${activeData.commodity_data.cover}`]"
                :initial-index="4"
                fit="cover"
              />
            </div>
            <div>名称:{{ activeData.commodity_data.name }}</div>
            <div>数量:{{ activeData.commodity_data.count }}</div>
            <div>价格:{{ activeData.commodity_data.price }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="仲裁者内容">{{
            activeData.plaintiff_content
          }}</el-descriptions-item>
          <el-descriptions-item label="仲裁者说明图" :span="2">
            <el-image
              v-for="(item, index) in activeData.reason_pic"
              :class="index && 'ml-2'"
              :key="item"
              style="width: 100px; height: 100px"
              :src="`${axios.defaults.baseURL}/${item}`"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="[`${axios.defaults.baseURL}/${item}`]"
              :initial-index="4"
              fit="cover"
            />
          </el-descriptions-item>
          <el-descriptions-item label="被仲裁者内容" :span="2">
            {{ activeData.defendant_content }}
          </el-descriptions-item>
          <el-descriptions-item label="被仲裁者说明图" :span="2">
            <el-image
              v-for="(item, index) in activeData.defendant_pic"
              :class="index && 'ml-2'"
              :key="item"
              style="width: 100px; height: 100px"
              :src="`${axios.defaults.baseURL}/${item}`"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="[`${axios.defaults.baseURL}/${item}`]"
              :initial-index="4"
              fit="cover"
            />
          </el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>
      <el-tab-pane label="处理" name="second">
        <el-form
          :label-width="100"
          ref="formRef"
          :model="form"
          :rules="rules"
          style="max-width: 100%"
        >
          <el-form-item label="选择支持者" prop="winner">
            <el-select v-model="form.winner" placeholder="选择胜利方" style="width: 240px">
              <el-option label="申诉人" :value="activeData.plaintiff_id">
                <div class="flex">
                  <img
                    :src="`${axios.defaults.baseURL}/${activeData.plaintiff_avatar}`"
                    alt="avater"
                    class="w-12 h-12"
                  />
                  <span class="ml-1"> {{ activeData.plaintiff_name }} </span>
                </div>
              </el-option>
              <el-option label="被申诉人" :value="activeData.defendant_id">
                <div class="flex">
                  <img
                    :src="`${axios.defaults.baseURL}/${activeData.defendant_avatar}`"
                    class="w-12 h-12"
                    alt="avater"
                  />
                  <span class="ml-1"> {{ activeData.defendant_name }} </span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客服说明" prop="note">
            <el-input v-model="form.note" type="textarea" />
          </el-form-item>
          <el-form-item label=" ">
            <el-button type="primary" @click="submitForm" :disabled="!!activeData.winner"
              >提交</el-button
            >
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script setup>
import { computed, ref } from "vue";
import useFetch from "@/hooks/useFetch";
import axios from "axios";
import { ElMessage } from "element-plus";
import { Delete } from "@element-plus/icons-vue";
import moment from "moment";

let { data, isLoading, refetch } = useFetch("/arbitrate/list/admin");

let activeName = ref("first");
let formRef = ref(null);
const rules = {
  winner: [{ required: true, message: "请选择胜利方", trigger: "blur" }],
  note: [{ required: true, message: "请填写客服说明", trigger: "blur" }],
};
let activeData = ref(null);
let show = computed(() => !!activeData.value);

let form = ref({
  winner: null,
  note: "",
});

watchEffect(() => {
  if (activeData.value?.winner) {
    form.value.winner = activeData.value.winner;
    form.value.note = activeData.value.note;
  }
});

const submitForm = params => {
  formRef.value.validate(valid => {
    if (valid) {
      axios.put(`/arbitrate/admin/${activeData.value.order_id}`, form.value).then(res => {
        if (res.data.success) {
          refetch();
          activeData.value = null;
          ElMessage.success(res.data.message);
        } else {
          ElMessage.error(res.data.message);
        }
      });
    }
  });
};

function close() {
  activeData.value = null;
  form.value = {
    winner: null,
    note: "",
  };
}

function isInThreeDays(time) {
  return +new Date() > +new Date(time) + 24 * 60 * 60 * 1000 * 3;
}

function timeToThreeDaysLater(time) {
  const targetTime = moment(time);
  const threeDaysLater = targetTime.add(3, "days");
  const duration = moment.duration(threeDaysLater.diff(moment()));

  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();
  return `${days}天${hours}小时${minutes}分钟${seconds}秒`;
}
</script>
<style scoped lang="scss"></style>
