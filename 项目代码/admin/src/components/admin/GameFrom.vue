<template>
  <el-form class="max-w-3xl" :model="form" label-width="120px" ref="formRef" :rules="formRules">
    <el-form-item label="商品名称" prop="name">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label="封面图片" prop="icon">
      <Upload
        :initValue="form.icon"
        @onSubmit="
          val => {
            form.icon = val;
          }
        "
      />
    </el-form-item>

    <el-form-item label="">
      <el-button @click="submitForm" block type="primary" class="w-60 mt-4">提交</el-button>
    </el-form-item>
  </el-form>
</template>
<script setup>
import { ref } from "vue";
import Upload from "@/components/Upload.vue";
import { watchEffect } from "vue";

// 表单属性以及验证配置
let formRef = ref();
let form = ref({
  name: "",
  icon: null,
});
const formRules = {
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  icon: [{ required: true, message: "请上传图标", trigger: "blur" }],
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
    let value = props.initValue;
    form.value = Object.assign(form.value, value);
    setTimeout(() => {
      if (stop) stop();
    }, 0);
  }
});
</script>
<style scoped lang="scss"></style>
