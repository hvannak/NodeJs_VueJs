import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { ValidationProvider,ValidationObserver } from "vee-validate"
import 'jquery/src/jquery.js'
import '@popperjs/core'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

Vue.component("ValidationProvider", ValidationProvider);
Vue.component("ValidationObserver",ValidationObserver);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
