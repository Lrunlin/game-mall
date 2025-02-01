<template>
  <van-nav-bar
    :title="messageList?.data?.user_data?.name || ''"
    left-text="返回"
    left-arrow
    @click-left="router.back()"
    fixed
    placeholder
  />
  <div id="chatBox" class="h-full w-full">
    <div id="chat" class="overflow-y-scroll">
      <div v-if="messageIsLoading">
        <van-skeleton title :row="3" />
        <van-skeleton title :row="3" />
        <van-skeleton title :row="3" />
      </div>
      <div v-else v-if="store.userData" v-for="(item, index) in data" :key="item.id">
        <!-- 单个聊天item user -->
        <div class="flex mt-3 ml-2" v-if="item.send_id != store.userData.id">
          <img
            class="w-12 h-12 rounded-full"
            :src="axios.defaults.baseURL + '/' + item.sender_avatar"
            alt="img"
          />
          <!-- 聊天气泡 -->
          <div v-if="item.picture" class="py-1 px-2 rounded-md bg-gray-100 ml-2 mr-4 max-w-[30%]">
            <img
              class="max-w-full"
              :src="axios.defaults.baseURL + '/' + item.picture"
              alt="picture"
            />
          </div>
          <div v-else class="py-1 px-2 rounded-md bg-gray-100 ml-2 mr-4">
            <div class="break-all">{{ item.content }}</div>
          </div>
        </div>
        <!-- 单个聊天item  -->
        <div class="mt-3 flex justify-end mr-3" v-else>
          <div class="flex justify-end">
            <div v-if="item.picture" class="py-1 px-2 rounded-md bg-gray-100 ml-2 mr-4 max-w-[30%]">
              <img
                class="max-w-full"
                :src="axios.defaults.baseURL + '/' + item.picture"
                alt="picture"
              />
            </div>
            <div v-else class="py-1 px-2 rounded-md bg-gray-100 ml-2 mr-4">
              <div class="break-all">{{ item.content }}</div>
            </div>
          </div>
          <!-- 头像 -->
          <img
            class="w-12 h-12 rounded-full"
            :src="axios.defaults.baseURL + '/' + item.sender_avatar"
            alt="img"
          />
        </div>
      </div>
    </div>
  </div>

  <div class="fixed w-full left-0 bottom-0 bg-white">
    <div class="flex items-center">
      <input @change="upload" accept="image/*" type="file" name="image" id="file" class="hidden" />
      <van-icon class="mx-2" name="photo" size="24" color="gray" @click="selectFile" />
      <van-field class="flex-1" v-model="content" placeholder="请输入搜索关键词" />
      <span @click="sendMessage" class="mr-2 cursor-pointer">发送</span>
    </div>
  </div>
  <van-back-top />
</template>
<script setup>
import { ref, onMounted, onUnmounted, watchEffect, computed } from "vue";
import { io } from "socket.io-client";
import useFetch from "@/hooks/useFetch";
import axios from "axios";
import { showFailToast, showNotify } from "vant";
import { useUserData } from "@/store/useUserData";

let route = useRoute();
let router = useRouter();
let store = useUserData();
let { data: messageList, isLoading: messageIsLoading } = useFetch("/message", {
  params: { receiverId: route.params.id },
});

let data = computed(() => JSON.parse(JSON.stringify(messageList?.value?.data?.message))); //一定要深拷贝
let stop = watchEffect(() => {
  if (messageList.value?.data) {
    setTimeout(() => {
      const container = document.querySelector("#chatBox");
      container.scrollTop = container.scrollHeight;
      window.scrollTo(0, container.scrollHeight);
      stop();
    }, 0);
  }
});

const socket = io(axios.defaults.baseURL, {
  path: "/online-message",
  transports: ["websocket"],
  withCredentials: true,
});

socket.on("message", data => {
  messageList?.value?.data?.message.push(data);
  setTimeout(() => {
    const container = document.querySelector("#chatBox");
    container.scrollTop = container.scrollHeight;
    window.scrollTo(0, container.scrollHeight);
  }, 0);
});

let content = ref("");
let picture = ref(null);

function sendMessage() {
  if (
    (/^[\s\S]*.*[^\s][\s\S]*$/.test(content.value) && !!content.value) ||
    (/^[\s\S]*.*[^\s][\s\S]*$/.test(picture.value) && picture.value)
  ) {
    axios
      .post("/message", {
        content: content.value,
        receive_id: route.params.id,
        picture: picture.value,
      })
      .then(res => {
        if (!res.data.success) {
          showFailToast("发送失败");
        } else {
          picture.value = null;
          content.value = "";
          messageList?.value?.data?.message.push(res.data.data);
          setTimeout(() => {
            const container = document.querySelector("#chatBox");
            container.scrollTop = container.scrollHeight;
            window.scrollTo(0, container.scrollHeight);
          }, 0);
        }
      });
  } else {
    showNotify({ type: "primary", message: "请填写内容或上传图片" });
  }
}
function upload() {
  const file = document.getElementById("file").files[0];
  const formData = new FormData();
  formData.append("image", file);
  axios
    .post("/static", formData)
    .then(res => {
      if (res.data.success) {
        picture.value = res.data.data;
        sendMessage();
      } else {
        showFailToast("上传失败");
      }
    })
    .catch(error => {
      showFailToast("上传失败");
    });
}

function selectFile() {
  document.getElementById("file").click();
}

onMounted(() => {
  document.body.classList.add("pb-14");
});
onUnmounted(() => {
  document.body.classList.remove("pb-14");
});
</script>
<style scoped lang="scss"></style>
<route lang="json">
{
  "meta": {
    "layout": "client-empty"
  }
}
</route>
