import Vue from 'vue';
import axios from 'axios';
import 'font-awesome/css/font-awesome.min.css';
import App from './App';
import router from './router';

Vue.prototype.$http = axios;

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});
