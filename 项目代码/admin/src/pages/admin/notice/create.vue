<template>
  <el-card>
    <el-form
      ref="formRef"
      :model="form"
      :rules="formRules"
      label-width="120px"
      style="width: 800px"
    >
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入标题" />
      </el-form-item>
      <el-form-item label="是否置顶" prop="isTop">
        <el-checkbox v-model="form.isTop" />
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <Edit :key="key" @onSubmit="val => (form.content = val)" />
      </el-form-item>
      <el-form-item label=" ">
        <el-button type="primary" @click="submit">发布</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script setup>
import { ref, computed } from "vue";
import Edit from "@/components/admin/ArticleEdit/Edit.vue";
import useFetch from "@/hooks/useFetch";
import axios from "axios";
import { ElMessage } from "element-plus";

let formRef = ref(null);

const formRules = {
  title: [
    { required: true, message: "请输入标题", trigger: "blur" },
    { max: 255, message: "标题不能超过255个字符", trigger: "blur" },
  ],
  content: [
    { required: true, message: "请输入内容", trigger: "blur" },
    { max: 1000, message: "内容不能超过1000个字符", trigger: "blur" },
  ],
  isTop: [{ required: true, message: "请选择", trigger: "blur" }],
};
let form = ref({
  title: "",
  content: "",
  isTop: false,
});

let key = ref(+new Date());
function submit() {
  formRef.value.validate(valid => {
    if (valid) {
      axios.post("/notice", form.value).then(res => {
        if (res.data.success) {
          ElMessage.success(res.data.message);
          form.value = {
            title: "",
            content: "",
            isTop: false,
          };
          key.value = +new Date();
        } else {
          ElMessage.error(res.data.message);
        }
      });
    }
  });
}
</script>
<style scoped lang="scss"></style>
