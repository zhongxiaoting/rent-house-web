<template>
  <div class="body">
    <div class="login-box">
      <div class="label-item">
        <h1>欢迎登录</h1>
      </div>
      <div class="label-item">
        <el-input placeholder="请输入账号" v-model="phone"></el-input>
      </div>
      <div class="label-item">
        <el-input placeholder="请输入密码" v-model="password"></el-input>
      </div>
      <div class="label-item submit-box">
        <el-button>注册</el-button>
        <el-button type="primary" @click="login">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapState, mapMutations} from "vuex";

export default {
  name: "login-view",
  data() {
    return {
      phone: '18812340001',
      password: '123456',
    }
  },
  computed: {
    ...mapState('publicStore', ['userList', 'isLogin'])
  },
  methods: {
    ...mapActions('publicStore', ['userLogin']),
    ...mapMutations('publicStore', ['updateCurrentUserInfo']),
    login() {
      const userInfo = this.userList.find(item => item.phone = this.phone)
      if (userInfo && this.password === userInfo.password) {
        this.userLogin()
        this.updateCurrentUserInfo(userInfo)
        this.$router.push({
          name: 'Home'
        })
      } else {
        this.$message.warning("账号或密码不正确")
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "/src/assets/global.scss";
.body {
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle, $primary-color, #9df6ff);
}

.login-box {
  padding: 10px;
  border-radius: 15px;
  background-color: #ffffff;

  .label-item {
    width: 400px;
    display: flex;
    padding: 10px;
    align-items: center;
  }

  .submit-box {
    display: flex;
    justify-content: space-between;
  }
}
</style>
