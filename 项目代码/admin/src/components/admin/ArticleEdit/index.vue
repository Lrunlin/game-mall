<template>
  <el-form class="max-w-3xl" :model="form" label-width="120px" ref="formRef" :rules="formRules">
    <el-form-item label="文章标题" prop="title">
      <el-input v-model="form.title" />
    </el-form-item>
    <el-form-item label="游戏选择" prop="game_id">
      <el-select v-model="form.game_id" placeholder="选择讲解游戏">
        <el-option
          v-if="gameList?.data"
          v-for="item in gameList.data"
          :key="item.value"
          :value="item.id"
          class="h-28"
        >
          <div class="flex">
            <div>
              <el-image
                class="w-[20px] h-[20px]"
                :src="axios.defaults.baseURL + '/' + item.icon"
                alt="cover"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                :preview-src-list="[axios.defaults.baseURL + '/' + item.icon]"
                :initial-index="0"
                fit="cover"
                :hide-on-click-modal="true"
                :preview-teleported="true"
              />
              <span class="ml-2">{{ item.name }}</span>
            </div>
          </div>
          <template #reference>
            <div class="flex item-center">
              <img class="w-9 h-9" :src="axios.defaults.baseURL + '/' + item.cover" alt="cover" />
              <span class="ml-2 truncate">{{ item.name }}</span>
            </div>
          </template>
        </el-option>
      </el-select>

      <div v-if="form.game_id" class="flex items-center cursor-pointer">
        <el-icon color="red" :size="24" class="ml-3" @click="form.game_id = null"
          ><CircleCloseFilled
        /></el-icon>
        <span class="ml-3">{{ gameList?.data.find(item => item.id == form.game_id).name }}</span>
      </div>
    </el-form-item>
    <el-form-item label="封面图片" prop="cover">
      <MultipleUpload
        :limit="3"
        :initValue="form.cover"
        @onSubmit="
          val => {
            form.cover = val;
          }
        "
      />
    </el-form-item>
    <el-form-item label="文章内容" prop="content">
      <Edit @onSubmit="val => (form.content = val)" :initValue="form.content" />
    </el-form-item>

    <el-form-item label="">
      <el-button @click="submitForm" block type="primary" class="w-60 mt-4">提交</el-button>
    </el-form-item>
  </el-form>
</template>
<script setup>
import { ref } from "vue";
import MultipleUpload from "@/components/MultipleUpload.vue";
import Edit from "./Edit.vue";
import { watchEffect } from "vue";
import useFetch from "@/hooks/useFetch";
import axios from "axios";
import { CircleCloseFilled } from "@element-plus/icons-vue";

// 表单属性以及验证配置
let formRef = ref();
let form = ref({
  title: "",
  content: "",
  cover: [],
  game_id: null,
});
const formRules = {
  title: [{ required: true, message: "请填写标题", trigger: "blur" }],
  content: [{ required: true, message: "请输入文章内容", trigger: "blur" }],
  cover: [
    {
      required: true,
      validator: (rule, value, callback) => {
        if (!Array.isArray(value)) {
          callback(new Error("封面必须是一个数组"));
        } else if (value.length < 1 || value.length > 3) {
          callback(new Error("请上传封面"));
        } else {
          // 通过验证
          callback();
        }
      },
      trigger: "blur",
    },
  ],
};
const submitForm = () => {
  formRef.value.validate(valid => {
    if (valid) {
      emit("onSubmit", form.value);
    }
  });
};

// 组件通信
const emit = defineEmits(["onSubmit"]);
const props = defineProps(["initValue"]);
let stop = watchEffect(() => {
  if (props.initValue) {
    form.value = props.initValue;
    setTimeout(() => {
      if (stop) stop();
    }, 0);
  }
});
// let { data: gameList } = useFetch("/commodity");
let { data: gameList } = useFetch("/game", { params: { state: 1 } });
</script>
<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
