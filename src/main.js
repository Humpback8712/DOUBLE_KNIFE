import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css' // 引入全局 css
import axios from 'axios'
import { Message, MessageBox } from 'element-ui'

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$prompt = MessageBox.prompt
// 可以配置请求的根路径
// axios.defaults.baseURL = '127.0.0.1'
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
