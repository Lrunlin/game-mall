<template>
  <van-form @submit="submitForm">
    <van-field
      v-model="form.name"
      name="name"
      label="商品名称"
      placeholder="请输入名称"
      :rules="[{ required: true, message: '请输入名称' }]"
    />
    <van-field
      v-model="form.description"
      name="description"
      label="商品介绍"
      type="textarea"
      autosize
      :rows="5"
      placeholder="请输入描述"
      :rules="[{ required: true, message: '请输入描述' }]"
    />
    <van-field
      v-model="form.game_type"
      name="game_type"
      label="选择游戏"
      :rules="[{ required: true, message: '请选择游戏' }]"
    >
      <template #input>
        <div class="text-gray-600" @click="show = true">
          <span v-if="form.game_type">{{
            data?.data.find(item => item.id == form.game_type)?.name
          }}</span>
          <span v-else>点击选择游戏</span>
        </div>
      </template>
    </van-field>
    <van-field
      name="inventory"
      label="当前库存"
      placeholder="请输入库存"
      :rules="[{ required: true, message: '请输入库存' }]"
    >
      <template #input>
        <van-stepper v-model="form.inventory" />
      </template>
    </van-field>
    <van-field
      name="price"
      label="价格"
      :rules="[{ required: true, type: 'number', message: '请输入价格' }]"
    >
      <template #input>
        <van-stepper input-width="90px" v-model="form.price" step="0.2" :decimal-length="1" />
      </template>
    </van-field>
    <van-field name="cover" label="封面图片" :rules="[{ required: true, message: '请上传封面' }]">
      <template #input>
        <VantUpload
          :initValue="props.initValue ? [props.initValue?.cover] : null"
          @onSubmit="val => (form.cover = val[0])"
        />
      </template>
    </van-field>
    <van-field
      name="banner"
      label="展示图片"
      :rules="[{ required: true, type: 'array', min: 1, max: 6, message: '请选择图片' }]"
    >
      <template #input>
        <VantUpload
          :max="6"
          :initValue="props.initValue?.banner"
          @onSubmit="val => (form.banner = val)"
        />
      </template>
    </van-field>
    <van-field
      name="tags"
      label="标签"
      :rules="[{ validator: validateTags, message: '有效标签要求1-10个' }]"
    >
      <template #input>
        <div>
          <div
            class="flex items-center mr-2"
            v-for="(item, index) in form.tags"
            :key="index + 'tag'"
          >
            <van-field v-model="form.tags[index]" placeholder="请输入标签" />
            <div class="flex items-center mr-2">
              <van-icon
                name="add"
                size="20"
                color="blue"
                v-if="form.tags.length - 1 == index"
                @click="form.tags.length < 10 && form.tags.push('')"
              />
              <van-icon
                name="clear"
                class="ml-4"
                size="20"
                color="red"
                @click="removeTag(index)"
                v-if="form.tags.length != 1"
              />
            </div>
          </div>
        </div>
      </template>
    </van-field>

    <van-button
      type="primary"
      block
      round
      class="!w-4/5 !mx-auto !mt-8 !mb-4"
      native-type="submit"
      :disabled="form.state == 0"
    >
      提交
    </van-button>
    <!-- remove位置 -->
    <slot></slot>
  </van-form>
  <van-dialog v-model:show="show" title="选择游戏" show-cancel-button :showConfirmButton="false">
    <div class="p-2 flex flex-wrap max-h-[500px] overflow-y-scroll">
      <div
        class="w-1/4 text-center mt-1"
        v-for="(item, index) in data?.data"
        :key="item.id"
        @click="
          () => {
            form.game_type = item.id;
            show = false;
          }
        "
      >
        <img
          class="w-10 h-10 rounded-md"
          :src="`${axios.defaults.baseURL}/${item.icon}`"
          alt="icon"
        />
        <div class="truncate">{{ item.name }}</div>
      </div>
    </div>
  </van-dialog>
</template>

<script setup>
import { ref } from "vue";
import { watchEffect } from "vue";
import VantUpload from "@/components/VantUpload";
import useFetch from "@/hooks/useFetch";
import axios from "axios";

// 表单属性以及验证配置
let form = ref({
  name: "",
  description: "",
  cover: null,
  banner: null,
  price: 100,
  inventory: 1,
  tags: [""],
  game_type: null,
});

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

const submitForm = () => {
  emit(
    "onSubmit",
    Object.assign(form.value, {
      tags: form.value.tags.filter(item => /^[\s\S]*.*[^\s][\s\S]*$/.test(item)),
    })
  );
};

const validateTags = val => {
  let number = form.value.tags.filter(item => /^[\s\S]*.*[^\s][\s\S]*$/.test(item)).length;
  return number >= 1 && number <= 10;
};
function removeTag(index) {
  form.value.tags.splice(index, 1);
}

let { data, isLoading } = useFetch("/game", { params: { state: 1 } });
let show = ref(false);
</script>

<style scoped lang="scss"></style>
