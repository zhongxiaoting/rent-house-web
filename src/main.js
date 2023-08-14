import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { registerBaiDuMap } from '/src/global/baidu-map'
import {cloneDeep} from "lodash";


Vue.config.productionTip = false
Vue.prototype.$cloneDeep = cloneDeep
Vue.prototype.$isEmpty = function(value) {
  return value === '' || value === null || value === undefined
}
Vue.use(ElementUI)
Vue.use(registerBaiDuMap)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
