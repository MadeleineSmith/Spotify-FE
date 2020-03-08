// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import axios from 'axios';
import Vuetify from 'vuetify';
import App from './App';
import router from './router';
import store from './store/index';

Vue.config.productionTip = false;

Vue.prototype.$http = axios;
Vue.prototype.$http.defaults.baseURL = process.env.BASE_URL;

Vue.use(Vuetify);
export default new Vuetify({});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  vuetify: new Vuetify(),
  axios,
  components: { App },
  store,
  template: '<App/>',
});
