export default {
  namespaced:true,
  state: {
    isLogin: false,
    userList: [
      {
        id: '1',
        phone: '18812340001',
        password: '123456',
        username: 'user1'
      },
      {
        id: '2',
        phone: '18812340001',
        password: '123456',
        username: 'user2',
      },
      {
        id: '3',
        phone: '18812340001',
        password: '123456',
        username: 'user3'
      },
      {
        id: '4',
        phone: '18812340001',
        password: '123456',
        username: 'user4',
      }
    ],
    currentUserInfo: {}
  },
  mutations: {
    updateIsLogin(state, value) {
      state.isLogin = value
    },
    updateCurrentUserInfo(state, value) {
      state.currentUserInfo = value
    }
  },
  actions: {
    userLogin({commit}) {
      commit('updateIsLogin', true)
    },
    userLogout({commit}) {
      commit('updateCurrentUserInfo', {})
      commit('updateIsLogin', false)
    }
  },
  modules: {
  }
}
