<template>
  <van-field v-model="title" label="标题" placeholder="输入文章标题" :maxlength="50" />
  <van-field name="uploader" label="封面上传">
    <template #input>
      <VantUpload :max="3" :initValue="coverInit" @onSubmit="val => (cover = val)" />
    </template>
  </van-field>
  <van-field name="game_id" label="选择游戏">
    <template #input>
      <div class="text-gray-600">
        <span v-if="game_id"
          >{{ data?.data.find(item => item.id == game_id)?.name }}
          <span class="ml-4" @click="game_id = null"
            ><van-icon class="text-red-600" name="cross" /></span
        ></span>
        <span @click="show = true" v-else>点击选择游戏</span>
      </div>
    </template>
  </van-field>
  <!-- <div class="mx-6 mt-3 flex items-center" v-if="gameData">
    <div class="!max-w-full">
      <van-card
        :price="gameData.price"
        :desc="gameData.description"
        :title="gameData.name"
        :thumb="`${axios.defaults.baseURL}/${gameData.cover}`"
        class="mr-4"
      />
    </div>
    <van-icon @click="game_id = null" size="20" color="red" name="clear" />
  </div> -->
  <div class="mx-2 mt-4 mb-6">
    <ArticleEdit @onSubmit="h => (html = h)" :initValue="html" />
  </div>
  <van-button @click="submit" type="primary" block round class="!w-3/6 !mx-auto !mb-8"
    >发布</van-button
  >

  <van-back-top />

  <van-dialog
    v-model:show="show"
    title="选择游戏"
    show-cancel-button
    @cancel="game_id = null"
    :showConfirmButton="false"
  >
    <div class="p-2 flex flex-wrap max-h-[500px] overflow-y-scroll">
      <div
        class="w-1/4 text-center mt-1"
        v-for="(item, index) in data?.data"
        :key="item.id"
        @click="
          () => {
            game_id = item.id;
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
let router = useRouter();
import axios from "axios";
import useFetch from "@/hooks/useFetch";
import empty from "@/assets/empty.png";
import { computed } from "vue";
import ArticleEdit from "@/components/admin/ArticleEdit/Edit";
import { showNotify } from "vant";
import VantUpload from "./VantUpload";

let { data: gameList } = useFetch("/game", { params: { state: 1 } });

let title = ref("");
let game_id = ref(null);
let html = ref("");

let gameData = computed(() => gameList.value?.data.find(item => item.id == game_id?.value));

let cover = ref([]);
let coverInit = ref(false);

let props = defineProps(["initValue"]);
let emit = defineEmits(["onSubmit"]);
let stop = watchEffect(() => {
  if (props.initValue) {
    title.value = props.initValue.title;
    game_id.value = props.initValue.game_id;
    html.value = props.initValue.content;
    cover.value = props.initValue.cover;
    coverInit.value = props.initValue.cover;

    setTimeout(() => {
      stop();
    }, 0);
  }
});

function submit() {
  if (/!^[\s\S]*.*[^\s][\s\S]*$/.test(title.value)) {
    showNotify({ type: "warning", message: "请填写标题" });
    return;
  }
  if (!/^[\s\S]*.*[^\s][\s\S]*$/.test(html.value)) {
    showNotify({ type: "warning", message: "请填写文章内容" });
    return;
  }
  if (cover.value.length == 0) {
    showNotify({ type: "warning", message: "封面图片的长度为1-3" });
    return;
  }

  emit("onSubmit", {
    title: title.value,
    game_id: game_id.value || null,
    cover: cover.value,
    content: html.value,
  });
}

let { data, isLoading } = useFetch("/game", { params: { state: 1 } });
let show = ref(false);
</script>
