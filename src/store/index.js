import Vue from 'vue'
import Vuex from 'vuex'
import publicStore from "@/store/modules/public";

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    publicStore,
  }
})
