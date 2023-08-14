<template>
  <div class="nav-box">
    <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        background-color="#008C9F"
        text-color="#5DC2CC"
        @select="handleSelect"
        active-text-color="#ffffff">
      <div class="left">
        <el-menu-item
            v-for="(item) in menuList"
            :key="item.key"
            :index="item.index"
            @click="handleRouterJump(item)"
        >{{ item.label }}</el-menu-item>
      </div>
      <div class="right">
        <div class="right-item hand">
          <div v-if="!isLogin" class="user-label" @click="toLogin">
            <span>登录</span>
          </div>
          <el-dropdown v-else :style="{height: '100%'}" @command="handleCommand">
            <div class="user-label">
              <span>{{ currentUserInfo.username }}</span>
              <img class="user-img" src="https://img.bosszhipin.com/boss/avatar/avatar_16.png" alt="">
            </div>
            <el-dropdown-menu>
              <el-dropdown-item
                  v-for="(item, index) in userSettingList"
                  :key="`item-${index}`"
                  :command="item.command"
              >{{ item.label }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </el-menu>
  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
  name: "nav-component",
  data() {
    return {
      defaultActiveIndex: '1',
      currActiveIndex: '',
      userSettingList: [
        {
          command: 'logout',
          label: '退出登录',
          clickFunction: this.logout,
          isHide: false,
        }
      ].filter(item => !item.isHide),

      menuList: [
        {
          key: 'home',
          index: '1',
          label: '首页',
          routerName: 'Home',
        },
        {
          key: 'job',
          index: '2',
          label: '岗位',
          routerName: 'ListView',
        },
        {
          key: 'house',
          index: '3',
          label: '房源',
          routerName: 'ListView',
        },
        {
          key: 'analysisHome',
          index: '4',
          label: '分析',
          routerName: 'AnalysisHome'
        }
      ]

    }
  },
  computed: {
    ...mapState('publicStore', ['currentUserInfo', 'isLogin']),
    activeIndex() {
      const {key} = this.$route.query
      const tipRouterName = this.$route.name
      const menu = this.menuList.find(item => item.key === key)
      if (menu && tipRouterName !== menu.routerName) {
        const index = this.menuList.find(item => item.routerName === tipRouterName)
        return index || '0'
      }
      if (['JobDetails', 'HouseDetails'].includes(this.$route.name)) {
        return ''
      }
      return menu ? menu.index : this.defaultActiveIndex
    }
  },
  methods: {
    ...mapActions('publicStore', ['userLogout']),
    handleSelect() {},

    toLogin() {
      this.$router.push({
        name: 'Login'
      })
    },

    handleRouterJump(item) {
      const currKey = this.$route.query.key
      const { key, routerName} = item
      const currRouterName = this.$route.name
      // const menu = this.menuList.find(item => item.key === key)
      if (routerName === currRouterName) {
        if (routerName === 'Home'){
          return false
        }
        if(currKey === key ){
          return false
        }
      }
      this.$router.push({
        name: routerName,
        query: {
          key: routerName === 'Home' ? undefined : key,
        }
      })
    },

    handleCommand(command) {
      if ('logout' === command) {
        this.logout()
      }
    },

    logout() {
      this.userLogout()
    }
  }
}
</script>

<style scoped lang="scss">
@import "/src/assets/global";


.el-menu.el-menu--horizontal {
  border: none;
}
.nav-box {
  display: flex;
  justify-content: center;
  background-color: $primary-color;

  .el-menu-demo {
    width: 1080px;
    display: flex;

    .left {
      display: flex;
      flex: 1;
    }

    .right {
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .right-item {
        height: 100%;
        font-size: 14px;
      }

      .right-item:not(:last-child) {
        margin-right: 10px;
      }

      .user-label {
        height: 100%;
        padding: 0 20px;
        display: flex;
        align-items: center;
        color: #ffffff;


        .user-img {
          margin-left: 10px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
      }

      .user-label:hover {
        background-color: rgb(0, 112, 127);
        transition: background-color 0.3s;
      }
    }
  }
}

.hand {
  cursor: pointer;
}
</style>
