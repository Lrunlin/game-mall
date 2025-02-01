<template>
  <van-nav-bar left-arrow @click-left="router.back()">
    <template #title>
      <van-search v-model="search" placeholder="请输入搜索关键词" @search="onSearch" />
    </template>
  </van-nav-bar>

  <div v-if="isLoading">
    <van-skeleton title :row="3" />
    <van-skeleton title :row="5" />
  </div>
  <div v-else>
    <div v-if="data?.data" class="p-2">
      <div class="break-all text-2xl font-bold">{{ data?.data.title }}</div>
      <div class="flex justify-between mt-6">
        <div class="flex">
          <!-- 用户头像 -->
          <img
            v-if="data?.data?.user_data"
            class="w-9 h-9 rounded-full"
            :src="axios.defaults.baseURL + '/' + data?.data.user_data.avatar"
            alt="cover"
          />
          <div class="ml-4">
            <div class="text-sm font-bold">
              {{ data?.data?.admin_data?.name || data?.data?.user_data?.name }}
            </div>
            <div class="text-xs text-[#ccccc]">
              {{ moment(data?.data.create_time).format("YYYY-MM-DD hh:mm:ss") }}
            </div>
          </div>
        </div>
      </div>
      <div id="content" v-html="data?.data.content"></div>
      <!-- 商品 -->
      <!-- <van-card
        v-if="data?.data?.commodity_data"
        class="!mt-10"
        @click="router.push(`/client/commodity/${data?.data.commodity_data.id}`)"
        :price="data?.data.commodity_data.price"
        :desc="data?.data.commodity_data.description"
        :title="data?.data.commodity_data.name"
        :thumb="axios.defaults.baseURL + '/' + data?.data.commodity_data.cover"
      /> -->
      <!-- <div
        v-if="data?.data?.commodity_data"
        class="mt-3"
        @click="router.push(`/client/commodity/${data?.data.commodity_data.id}`)"
      >
        <div class="pl-3 border-0 border-l-4 border-solid border-[#2873FF]">本文产品</div>
        <div class="mt-2 font-bold">{{ data?.data.commodity_data.name }}</div>
        <img
          class="w-full"
          :src="axios.defaults.baseURL + '/' + data?.data.commodity_data.cover"
          alt="COVER"
        />
      </div> -->
      <!-- 评论 -->
      <div>
        <div class="pl-3 mt-8 border-0 border-l-4 border-solid border-[#2873FF]">评论</div>
        <van-field
          v-model="message"
          rows="2"
          autosize
          type="textarea"
          maxlength="50"
          placeholder="请输入评论"
          show-word-limit
        />
        <van-button
          type="primary"
          size="small"
          class="mt-4"
          block
          :disabled="!/^[\s\S]*.*[^\s][\s\S]*$/.test(message)"
          @click="comment"
          @focus="reply_id = null"
          >评论</van-button
        >
      </div>
      <!-- 评论区 -->
      <div
        class="flex mt-6 px-2 mb-10"
        v-if="commentData?.data"
        v-for="(item, index) in commentData.data"
        :key="item.id"
      >
        <!-- 头像区域 -->
        <div>
          <img
            class="w-8 h-8 rounded-full"
            :src="axios.defaults.baseURL + '/' + item.user_data.avatar"
            alt="COVER"
          />
        </div>
        <!-- 评论内容区域 -->
        <div class="ml-2 flex-1">
          <div class="font-bold text-sm h-8 flex items-center">{{ item.user_data.name }}</div>
          <div class="break-all">{{ item.content }}</div>
          <div class="flex justify-end">
            <span
              class="mr-3 text-sm text-gray-400 cursor-pointer"
              v-if="store.userData && reply_id != item.id"
              @click="
                () => {
                  reply_id = item.id;
                  reply_content = '';
                }
              "
              >回复</span
            >
            <span
              class="mr-3 text-sm text-gray-400 cursor-pointer"
              v-if="store.userData && reply_id == item.id"
              @click="reply_id = null"
              >取消回复</span
            >
            <span
              class="mr-3 text-sm text-gray-400 cursor-pointer"
              v-if="store.userData.id == item.user_id"
              @click="remove(item.id)"
              >删除</span
            >
          </div>
          <div class="mt-2 text-sm text-[#666d7f]">
            {{ moment(item.create_time).format("YYYY-MM-DD hh:mm:ss") }}
          </div>
          <!-- 一级评论的回复 -->
          <div class="mt-2" v-if="reply_id == item.id">
            <van-field
              v-model="reply_content"
              rows="2"
              autosize
              type="textarea"
              maxlength="50"
              placeholder="请输入评论"
              show-word-limit
            />
            <div class="flex justify-end mt-2">
              <van-button
                type="primary"
                size="mini"
                :disabled="!/^[\s\S]*.*[^\s][\s\S]*$/.test(reply_content)"
                @click="comment"
                >回复</van-button
              >
            </div>
          </div>

          <!-- 子评论 -->
          <div v-if="item?.children?.length" class="bg-[#f8f9fc] mt-3 w-full px-1 py-2 rounded">
            <div class="" v-for="(_item, index) in item.children" :key="_item.id">
              <span class="text-blue-500">{{ _item.user_data.name }}:</span>
              <span>
                <span v-if="item.id != _item.reply" class="text-blue-500 mr-1"
                  >@{{ _item.reply_data.name }}</span
                >
                <span>{{ _item.content }}</span>
              </span>
              <div class="w-full mt-1 text-sm flex justify-end">
                <span
                  class="mr-3 cursor-pointer"
                  v-if="store.userData.id == _item.user_id"
                  @click="remove(_item.id)"
                  >删除</span
                >
                <span
                  class="mr-1 cursor-pointer"
                  v-if="reply_id == _item.id"
                  @click="reply_id = null"
                  >取消回复</span
                >
                <span
                  v-else
                  class="mr-1 cursor-pointer"
                  @click="
                    () => {
                      reply_id = _item.id;
                      reply_content = '';
                    }
                  "
                  >回复</span
                >
              </div>
              <!-- 回复框 -->
              <div class="mt-2" v-if="reply_id == _item.id">
                <van-field
                  v-model="reply_content"
                  rows="2"
                  autosize
                  type="textarea"
                  maxlength="50"
                  placeholder="请输入评论"
                  show-word-limit
                />
                <div class="flex justify-end mt-2">
                  <van-button
                    type="primary"
                    size="mini"
                    :disabled="!/^[\s\S]*.*[^\s][\s\S]*$/.test(reply_content)"
                    @click="comment"
                    >回复</van-button
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <van-empty description="没找到对应文章">
        <van-button round type="primary" class="w-40" @click="router.go(-1)">返回</van-button>
      </van-empty>
    </div>
  </div>
</template>
<script setup>
import { ref, watchEffect } from "vue";
import useFetch from "@/hooks/useFetch";
import axios from "axios";
import moment from "moment";
import { showSuccessToast, showFailToast } from "vant";
import { useUserData } from "@/store/useUserData";

let store = useUserData();

let route = useRoute();
let router = useRouter();
let { data, isLoading } = useFetch("/article/" + route.params.id);
let { data: commentData, refetch } = useFetch("/comment/" + route.params.id);

let message = ref(""); //主输入框

let reply_content = ref(""); //回复内容
let reply_id = ref(null); //回复消息的ID

let search = ref("");
function onSearch(params) {
  if (/^[\s\S]*.*[^\s][\s\S]*$/.test(params)) {
    router.push({ path: "/client/article/search", query: { keyword: params } });
  }
}

function comment() {
  axios
    .post("/comment", {
      article_id: route.params.id,
      reply: reply_id.value,
      content: message.value || reply_content.value,
    })
    .then(res => {
      if (res.data.success) {
        message.value = "";
        reply_content.value = "";
        refetch();
        showSuccessToast("评论成功");
      } else {
        showFailToast("评论失败");
      }
    });
}

function remove(id) {
  axios.delete("/comment/" + id).then(res => {
    if (res.data.success) {
      refetch();
      showSuccessToast("删除成功");
    } else {
      showFailToast("删除失败");
    }
  });
}
</script>
<style  lang="scss">
#content {
  word-break: break-all;
  img {
    max-width: 100%;
  }
}
</style>
<route lang="json">
{
  "meta": {
    "layout": "client-empty"
  }
}
</route>
