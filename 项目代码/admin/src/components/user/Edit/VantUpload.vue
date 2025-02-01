<template>
  <van-uploader v-model="fileList" :max="props.max || 1" :after-read="afterRead" @delete="remove" />
</template>
<script setup>
import { ref, watchEffect } from "vue";
import axios from "axios";

let props = defineProps(["max-count", "initValue"]);

const fileList = ref([]);
let data = ref([]);

let stop = watchEffect(() => {
  if (props.initValue) {
    fileList.value = props.initValue.map(item => ({
      id: item,
      url: `${axios.defaults.baseURL}/${item}`,
    }));
    data.value = props.initValue;
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
      data.value.push(res.data.data);
      fileList.value[fileList.value.length - 1].id = res.data.data;
      emit("onSubmit", data.value);
    }
  });
};
function remove(params) {
  data.value = data.value.filter(item => item != params.id);
  emit("onSubmit", data.value);
}
</script>
<style scoped lang="scss"></style>
