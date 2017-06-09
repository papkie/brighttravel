import Vue from 'vue';
import Main from './app/Main.vue';

import './index.scss';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import 'vuetify/dist/vuetify.min.css';
import Vuetify from 'vuetify';
Vue.use(Vuetify);

import VueResource from 'vue-resource';
Vue.use(VueResource);
if (process.env.NODE_ENV === 'development') {
  Vue.http.options.root = 'http://localhost:9000';
}
Vue.http.interceptors.push((request, next) => {
  // request.headers['Accept'] = 'application/json';
  if (localStorage.getItem('token')) {
    if (request.method === 'GET') {
      request.url += '?access_token=' + localStorage.getItem('token');
    } else {
      if (!request.body) {
        request.body = {};
      }
      request.body['access_token'] = localStorage.getItem('token'); // eslint-disable-line
    }
  }
  next();
});

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
