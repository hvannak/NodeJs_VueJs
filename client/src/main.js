import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { ValidationProvider,ValidationObserver,extend } from "vee-validate"
import { required, email, min } from "vee-validate/dist/rules";
import 'jquery/src/jquery.js'
import '@popperjs/core'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

Vue.component("ValidationProvider", ValidationProvider);
Vue.component("ValidationObserver",ValidationObserver);

Vue.config.productionTip = false

extend("required", {
  ...required,
  message: validationField('Require'),
});

extend("min", {
  ...min,
  message: "{_field_} may not be lesser than {length} characters",
});

extend("email", {
  ...email,
  message: validationField('Email')
});

function validationField(name){
  let validation = localStorage.getItem('validation');
  console.log(JSON.parse(validation).filter(x=>x.props == name)[0].text);
  let field = JSON.parse(validation).filter(x=>x.props == name)[0].text;
  return field
}

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
