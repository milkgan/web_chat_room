<template>
  <Login v-if="!is_Login" @loginSuccess="loginSuccess" />
  <ChatWindow
    v-else
    :my_name="my_name"
    :history="history"
    :users="users"
    @chat="handleChat"
  />
  
</template>

<script>
import { toRefs, reactive, ref } from "vue";
import { io } from "socket.io-client";
import ChatWindow from "@/components/ChatWindow";
import Login from "@/components/Login";
export default {
  name: "App",
  components: { ChatWindow, Login },
  setup() {
    /* ChatWindwo相关 */
    let chat_data = reactive({
      my_name: "",
      history: [],
      users: [],
    });
    // 建立socket连接
    const socket = io("http://localhost:3000", { path: "/chat" });
    // 备注：这部分因为是on监听所以是放出来，而不是放到socket.emit("$login",(socket)=>{})里面
    socket.on("$name", (name) => {
      chat_data.my_name = name;
    });
    socket.on("$history", (history) => {
      chat_data.history = history;
    });
    socket.on("$updateUser", (users) => {
      chat_data.users = users;
    });
    socket.on("$message", (msg) => {
      chat_data.history.push(msg);
    });

    /* 添加聊天记录 */
    function handleChat(msg) {
      // 发送方添加聊天记录，时间由发送方决定
      chat_data.history.push(msg);
      // 服务端添加聊天记录，时间由服务端决定
      socket.emit("$message", msg.name, msg.content);
    }

    /* Login相关 */
    let is_Login = ref(false);

    /* 登录成功触发 */
    function loginSuccess(username) {
      is_Login.value = true;
      socket.emit("$login", username);
    }

    return {
      ...toRefs(chat_data),
      handleChat,
      is_Login,
      loginSuccess
    };
  },
};

</script>

<style>
html{
  height: 100%;
}
body {
  height: 100%;
  margin: 0;
}
#app {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: linear-gradient(to right, #ffc3a0 0%, #ffafbd 100%);
}
</style>

