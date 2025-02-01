<template>
  <el-form class="max-w-3xl" :model="form" label-width="120px" ref="formRef" :rules="formRules">
    <el-form-item label="商品名称" prop="name">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label="商品介绍" prop="description">
      <el-input v-model="form.description" :rows="2" type="textarea" />
    </el-form-item>
    <el-form-item label="当前库存" prop="inventory">
      <el-input-number v-model="form.inventory" :step="1" :min="0" />
    </el-form-item>
    <el-form-item label="参考价格" prop="price">
      <el-input-number v-model="form.price" :precision="2" :step="10" :min="0" />
    </el-form-item>
    <el-form-item label="封面图片" prop="cover">
      <Upload
        :initValue="form.cover"
        @onSubmit="
          val => {
            form.cover = val;
          }
        "
      />
    </el-form-item>
    <el-form-item label="展示图片" prop="banner">
      <MultipleUpload
        :initValue="form.banner"
        @onSubmit="
          val => {
            form.banner = val;
          }
        "
      />
    </el-form-item>
    <el-form-item label="配置" prop="configuration">
      <div
        class="flex"
        :class="index && 'mt-2'"
        v-for="(item, index) in componentArray"
        :key="`component-${index}-${componentArray.length}`"
      >
        <el-input
          class="w-20"
          v-model="componentArray[index][0]"
          placeholder="填写属性"
          @change="val => setKey(val, index)"
        />
        <el-input
          class="w-20 ml-4"
          v-model="componentArray[index][1]"
          placeholder="填写属性值"
          @change="val => setValue(val, index)"
        />
        <el-button
          class="ml-4"
          type="primary"
          :icon="CloseBold"
          v-if="index"
          @click="
            () => {
              componentArray.splice(index, 1);
              arrSwitch();
            }
          "
        />
        <el-button
          class="ml-4"
          type="primary"
          :icon="Plus"
          v-if="index + 1 == componentArray.length"
          @click="
            () => {
              addRow();
              arrSwitch();
            }
          "
        />
      </div>
    </el-form-item>

    <el-form-item label="">
      <el-button @click="submitForm" block type="primary" class="w-60 mt-4">提交</el-button>
    </el-form-item>
  </el-form>
</template>
<script setup>
import { ref } from "vue";
import MultipleUpload from "@/components/MultipleUpload.vue";
import Upload from "@/components/Upload.vue";
import { watchEffect } from "vue";
import { Plus, CloseBold } from "@element-plus/icons-vue";

// 表单属性以及验证配置
let formRef = ref();
let form = ref({
  name: "",
  description: "",
  cover: null,
  banner: null,
  price: 100,
  configuration: {},
  market_time: new Date(),
  inventory: 0,
});
const formRules = {
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  description: [{ required: true, message: "请输入描述", trigger: "blur" }],
  price: [{ required: true, type: "number", message: "请输入价格", trigger: "blur" }],
  cover: [{ required: true, message: "请输入封面", trigger: "blur" }],
  banner: [
    { required: true, type: "array", message: "请选择横幅", trigger: "change" },
    { type: "array", min: 1, max: 6, message: "横幅数量为1-6个", trigger: "change" },
  ],
  configuration: [
    { required: true, type: "object", message: "请输入配置", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        let condition = Object.keys(value).some((item, index) => {
          return (
            /^[\s\S]*.*[^\s][\s\S]*$/.test(item) &&
            /^[\s\S]*.*[^\s][\s\S]*$/.test(Object.values(value)[index])
          );
        });
        if (condition) {
          callback();
        } else {
          callback(new Error("配置不能为空"));
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

// “配置”组件部分处理
let componentArray = ref([["", ""]]); //当前一共有多少组输入框（二维数组存储值）

function addRow() {
  componentArray.value = [...componentArray.value, ["", ""]];
}
function setKey(val, index) {
  let arr = componentArray.value;
  arr[index][0] = val;
  componentArray.value = arr;
  arrSwitch();
}
function setValue(val, index) {
  let arr = componentArray.value;
  arr[index][1] = val;
  componentArray.value = arr;
  arrSwitch();
}
// 将二维数组转为对象
function arrSwitch() {
  form.value.configuration = {};
  let obj = {};
  componentArray.value.forEach(item => {
    if (/^[\s\S]*.*[^\s][\s\S]*$/.test(item[0]) && /^[\s\S]*.*[^\s][\s\S]*$/.test(item[1])) {
      obj[item[0]] = item[1];
    }
  });
  form.value.configuration = obj;
}

// 组件通信
const emit = defineEmits(["onSubmit"]);
const props = defineProps(["initValue"]);
let stop = watchEffect(() => {
  if (props.initValue) {
    let value = props.initValue;
    componentArray.value = Object.entries(value.configuration);
    form.value = Object.assign(form.value, value);
    setTimeout(() => {
      if (stop) stop();
    }, 0);
  }
});
</script>
<style scoped lang="scss"></style>
