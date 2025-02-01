<template>
  <el-upload
    v-model:file-list="fileList"
    name="image"
    accept="image/*"
    :action="url"
    list-type="picture-card"
    :multiple="true"
    :on-preview="handlePictureCardPreview"
    :limit="props.limit || 6"
    :on-success="success"
    :on-remove="remove"
  >
    <el-icon><Plus /></el-icon>
  </el-upload>
  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" class="max-w-full" alt="Preview Image" />
  </el-dialog>
</template>
<script setup>
import { ref } from "vue";
import axios from "axios";
import { Plus } from "@element-plus/icons-vue";
import { watchEffect, watch } from "vue";

let url = axios.defaults.baseURL + "/static";
let emit = defineEmits(["onSubmit"]);
let props = defineProps(["initValue", "limit"]);
let fileList = ref([]);
let list = ref([]);

const dialogImageUrl = ref("");
const dialogVisible = ref(false);
// 设置初始值
let stop = watchEffect(() => {
  if (props.initValue) {
    fileList.value = props.initValue.map(item => {
      return {
        name: item,
        url: axios.defaults.baseURL + "/" + item,
        uid: +new Date() + "" + Math.random(),
      };
    });
    list.value = props.initValue;
    setTimeout(() => {
      if (stop) stop();
    }, 0);
  }
});

const handlePictureCardPreview = uploadFile => {
  dialogImageUrl.value = uploadFile.url;
  dialogVisible.value = true;
};

function success(params) {
  if (params.success) {
    list.value.push(params.data);
    fileList.value[fileList.value.length - 1].name = params.data;
  }
}
function remove(params) {
  let index = list.value.indexOf(params.name);
  if (index != -1) {
    list.value.splice(index, 1);
  }
}
watch(list.value, newValue => {
  emit("onSubmit", newValue);
});
</script>
<style scoped lang="scss">
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
