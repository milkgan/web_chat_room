<template>
  <div class="chat-wrapper">
    <!-- 用户列表 -->
    <div class="user-list">
      <div class="list-title">当前在线用户（{{ users.length }}）</div>
      <ul>
        <li v-for="username in users" :key="username">{{ username }}</li>
      </ul>
    </div>
    <!-- 聊天框 -->
    <div class="chat-box">
      <!-- 标题 -->
      <div class="chat-title">喵喵喵~</div>
      <!-- 聊天框内容主体 -->
      <div class="chat-history" ref="history_box">
        <div
          :class="chat.name === my_name ? 'item cur-user' : 'item'"
          v-for="chat in history"
          :key="chat"
        >
          <div class="avatar">
            <img src="../assets/img/avatar.jpg" :alt="chat.name" />
          </div>
          <div class="history">
            <div class="username">{{ chat.name }}</div>
            <div class="history-content-box">
              <div class="history-content">{{ chat.content }}</div>
            </div>
            <div class="history-time">{{ fomartDate(chat.date) }}</div>
          </div>
        </div>
      </div>
      <!-- 发送聊天内容区域 -->
      <div class="chat-content">
        <textarea
          class="content-area"
          cols="30"
          rows="3"
          v-model="val"
          @keyup.enter="handleSend"
        ></textarea>
        <div class="send-btn" @click="handleSend">发&nbsp;&nbsp;送</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, nextTick, watch } from "vue";
import monment from "moment";
monment.locale("zh-cn");

export default {
  props: {
    my_name: {
      type: String,
      required: true,
    },
    history: {
      type: Array,
      default: () => [],
    },
    users: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["chat"],
  setup(props, context) {
    // 消息内容
    let val = ref("");
    // history-box
    let history_box = ref(null);
    
    /* 发送消息内容 */
    async function handleSend() {
      let content = val.value.trim();
      if (content === "") return;
      let msg = {
        name: props.my_name,
        content,
        date: Date.now(),
      };
      context.emit("chat", msg);
      // 发送后清空内容值
      val.value = "";
    }

    /* 格式化时间 */
    function fomartDate(date) {
      let date_time = monment(date);
      return date_time.fromNow();
    }

    /* 更新滚动条位置 */
    async function updateHistoryScrollHeight() {
      await nextTick();
      history_box.value.scroll(0, history_box.value.scrollHeight);
    }
    watch(
      () => props.history,
      () => {
        updateHistoryScrollHeight();
      },
      { deep: true }
    );

    return {
      handleSend,
      val,
      history_box,
      fomartDate,
    };
  },
};
</script>

<style lang="less">
@import url("../assets/css/color.less");

.chat-wrapper {
  width: 600px;
  height: 600px;
  border: 1px solid rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  display: flex;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;

  // user list
  .user-list {
    width: 24%;
    height: 100%;
    font-size: 16px;
    box-sizing: border-box;
    background-color: @user-list-bg-color;
    border-right: 1px solid rgba(0, 0, 0, 0.5);
    color: @bg-base-font-color;
    .list-title {
      font-size: 14px;
      width: 100%;
      padding: 0 4px;
      box-sizing: border-box;
      line-height: 36px;
      text-align: center;
      border-bottom: 1px solid @chat-title-bg-color;
      box-sizing: border-box;
    }
    ul {
      padding: 0;
      margin: 0;
      list-style: none;
      cursor: default;
      li {
        line-height: 20px;
        padding: 8px;
        border-bottom: 1px solid @chat-title-bg-color;
      }
      li:hover {
        background-color: rgba(255, 255, 255, 0.5);
      }
    }
  }
  // chat content box
  .chat-box {
    flex: 1;
    display: flex;
    flex-direction: column;

    .chat-title {
      width: 100%;
      height: 36px;
      font-size: 18px;
      line-height: 36px;
      text-align: center;
      color: #fff;
      background-color: @chat-title-bg-color;
    }
    .chat-history {
      flex: 1;
      overflow: auto;
      background-color: @history-bg-color;
      padding-bottom: 10px;

      .item {
        margin-top: 10px;
        display: flex;
        .avatar {
          width: 36px;
          height: 36px;
          background-color: #ccc;
          border-radius: 50%;
          margin: 16px 10px 0;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .history {
          // width: 50%;
          // 给定长，调整整个聊天文字内容(全是中文)左右对齐边距一致
          font-size: 14px;
          width: 16em;

          .username {
            font-size: 12px;
            color: rgb(112, 128, 144);
            margin-bottom: 4px;
          }
          .history-content {
            position: relative;
            font-size: 14px;
            line-height: 20px;
            display: inline-block;
            // text-align: justify;// 内容两端对齐
            box-sizing: border-box;
            border-radius: 4px;
            padding: 6px;
            word-break: break-all;
            background-color: @other-user-bg-color;
          }
          .history-content::before {
            position: absolute;
            left: -14px;
            top: 8px;
            content: "";
            width: 0;
            height: 0;
            border: 8px solid transparent;
            border-right-color: @other-user-bg-color;
          }
          .history-time {
            font-size: 10px;
            margin-top: 2px;
            color: rgb(112, 128, 144);
          }
        }
      }

      .cur-user {
        flex-direction: row-reverse;
        .history {
          .history-content-box {
            width: 100%;
            display: flex;
            justify-content: flex-end;
            .history-content {
              background-color: @cur-user-bg-color;
            }
            .history-content::before {
              left: calc(100% - 2px);
              border: 8px solid transparent;
              border-left-color: @cur-user-bg-color;
            }
          }
          .username,
          .history-time {
            text-align: right;
          }
        }
      }
    }
    .chat-content {
      width: 100%;
      height: 120px;
      background-color: #fff;
      box-sizing: border-box;
      border-top: 1px solid rgba(0, 0, 0, 0.5);
      .content-area {
        width: 100%;
        overflow-y: visible;
        font-size: 16px;
        line-height: 20px;
        resize: none;
        outline: none;
        padding: 6px 10px;
        border: none;
        box-sizing: border-box;
      }
      .send-btn {
        width: 16%;
        height: 30px;
        font-size: 16px;
        font-weight: bold;
        line-height: 30px;
        text-align: center;
        border-radius: 10px;
        background-color: @chat-title-bg-color;
        color: @bg-base-font-color;
        margin-top: 4px;
        margin-left: 80%;
        cursor: pointer;
      }
    }
  }
}
/* 屏幕宽度<=768px样式 */
@media screen and (max-width: 768px) {
  .chat-wrapper {
    width: 100%;
    height: 100%;
    border-radius: 0;
    border: none;
    .user-list {
      width: 26%;
      padding: 0 2px;
    }
    .chat-box {
      margin-bottom: 20px;
      .chat-history .item .history {
        font-size: 14px;
        width: 12em;
      }
      .chat-content .send-btn {
        width: 20%;
        margin-left: 70%;
      }
    }
  }
}
</style>