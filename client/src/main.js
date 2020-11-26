import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import { ValidationProvider,ValidationObserver } from "vee-validate";

Vue.component("ValidationProvider", ValidationProvider);
Vue.component("ValidationObserver",ValidationObserver);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
