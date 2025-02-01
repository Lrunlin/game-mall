<template>
  <el-dialog
    class="banner"
    :destroy-on-close="true"
    :append-to-body="true"
    v-model="props.dialogTableVisible"
    title="轮播图编辑"
    @close="close"
  >
    <el-form class="max-w-3xl" :model="form" label-width="120px" ref="formRef" :rules="formRules">
      <el-form-item label="跳转链接" prop="url">
        <el-input v-model="form.url" />
      </el-form-item>
      <el-form-item label="轮播图片" prop="cover">
        <el-upload
          class="avatar-uploader"
          :action="url"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          name="image"
          accept="image/*"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item label="">
        <el-button @click="submitForm" block type="primary" class="w-60 mt-4">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { Plus } from "@element-plus/icons-vue";

let url = axios.defaults.baseURL + "/static";
let imageUrl = ref(false);

function handleAvatarSuccess(params) {
  imageUrl.value = axios.defaults.baseURL + "/" + params.data;
  form.value.cover = params.data;
}
let props = defineProps(["dialogTableVisible", "initValue"]);

let formRef = ref();
let form = ref({ url: "", cover: null });
const formRules = {
  cover: [{ required: true, message: "请上传轮播图片", trigger: "blur" }],
};

const emit = defineEmits(["onSubmit", "update:dialogTableVisible"]);
// 设置初始值
watchEffect(() => {
  if (props.initValue) {
    form.value = props.initValue;
    imageUrl.value = axios.defaults.baseURL + "/" + props.initValue.cover;
  }
});

const submitForm = () => {
  formRef.value.validate(valid => {
    if (valid) {
      emit("onSubmit", form.value);
    }
  });
};

function close() {
  emit("update:dialogTableVisible", false);
}
</script>
<style scoped>
.avatar-uploader .avatar {
  width: 375px;
  height: 150px;
  display: block;
}
</style>

<style lang="scss">
.banner {
  .avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

  .avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
  }

  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 375px;
    height: 150px;
    text-align: center;
  }
}
</style>
