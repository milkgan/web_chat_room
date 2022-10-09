<template>
  <div class="login-wrapper">
    <div class="login-title">web在线聊天室</div>
    <div class="login-box">
      <div class="avatar">
        <img src="../assets/img/login.jpg" alt="登录" />
      </div>
      <span class="login-cat">一起喵喵喵呀~</span>
      <div class="username">
        <span>用户名:</span>
        <input
          type="text"
          v-model="name"
          @keyup.enter="handleLogin"
          placeholder="请敲下您的大名！"
        />
      </div>
      <div class="login-btn" @click="handleLogin">登&nbsp;&nbsp;录</div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "axios";
export default {
  emits: ["loginSuccess"],
  setup(props, context) {
    let name = ref("");

    /* 登录 */
    function handleLogin() {
      let username = name.value.trim();
      if (username === "") return;
      axios
        .post("http://localhost:3000/login", {
          username: username,
        })
        .then(
          (res) => {
            if (res.data.code === 200) {
              context.emit("loginSuccess", res.data.msg.username);
            }else {
              console.log(res.data.msg);
            }
          },
          (err) => {
            console.log(err.message);
          }
        );
    }
    return {
      name,
      handleLogin,
    };
  },
};
</script>

<style lang="less" scoped>
@import url("../assets/css/color.less");

.login-wrapper {
  width: 500px;
  height: 500px;
  border-radius: 20px;
  background-color: antiquewhite;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;// 解决margin塌陷
  .login-title {
    font-size: 24px;
    line-height: 24px;
    font-weight: bold;
    text-align: center;
    margin: 60px auto 30px;
    color: @bg-base-font-color;
  }
  .login-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      overflow: hidden;
      margin-bottom: 4px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .login-cat {
      color: @bg-base-font-color;
    }
    .username {
      margin-top: 10px;
      color: @bg-base-font-color;
      font-weight: bold;
      font-size: 16px;
      line-height: 28px;
      input {
        margin: 0;
        height: 40px;
        width: 160px;
        font-size: 14px;
        line-height: 40px;
        outline: none;
        border: none;
        border-radius: 20px;
        padding: 0 20px;
        margin: 10px 10px 30px;
      }
    }
    .login-btn {
      width: 80px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: #fff;
      background-color: @chat-title-bg-color;
      border-radius: 6px;
    }
  }
}

@media screen and (max-width: 768px) {
  .login-wrapper {
    width: 100%;
    height: 100%;
    border-radius: 0;
    box-shadow: none;
    .login-title {
      margin-bottom: 60px;
    }
  }
}
</style>