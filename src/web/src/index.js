import Vue from 'vue';
import Main from './app/Main.vue';

import './index.scss';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import 'vuetify/dist/vuetify.min.css';
import Vuetify from 'vuetify';
Vue.use(Vuetify);

const router = new VueRouter({
  routes: [
    {
      path: '/',
      components: {
        default: Main
      }
    }
  ]
});

export default new Vue({
  el: '#root',
  router,
  render: h => h('router-view')
});
