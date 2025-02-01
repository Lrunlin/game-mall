<template>
  <van-uploader
    v-model="fileList"
    :max-count="props.max || 1"
    :after-read="afterRead"
    @delete="remove"
    :disabled="props.disabled"
  />
</template>
<script setup>
import { ref, watchEffect } from "vue";
import axios from "axios";

let props = defineProps(["max", "initValue", "disabled"]);
const fileList = ref([]);

let stop = watchEffect(() => {
  if (props.initValue) {
    fileList.value = props.initValue.map(item => ({
      id: item,
      url: `${axios.defaults.baseURL}/${item}`,
    }));

    setTimeout(() => {
      stop();
    }, 0);
  }
});
let emit = defineEmits(["onSubmit"]);
const afterRead = file => {
  const forms = new FormData();
  forms.append("image", file.file);

  axios.post("/static", forms).then(res => {
    if (!res.data.success) {
      file.status = "failed";
      file.message = "上传失败";
    } else {
      fileList.value[fileList.value.length - 1].id = res.data.data;
      emit(
        "onSubmit",
        fileList.value.map(item => item.id)
      );
    }
  });
};

function remove(parmas) {
  emit(
    "onSubmit",
    fileList.value.map(item => item.id)
  );
}
</script>
<style scoped lang="scss"></style>
