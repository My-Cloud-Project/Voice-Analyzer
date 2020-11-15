import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueSweetalert2 from 'vue-sweetalert2'
import AudioRecorder from 'vue-audio-recorder'

Vue.use(AudioRecorder)
Vue.use(VueSweetalert2);

Vue.prototype.$https = axios.create({
  baseURL: "",
  timeout: 20000
});


Vue.config.productionTip = false
Vue.use(require('vue-shortkey'))

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
