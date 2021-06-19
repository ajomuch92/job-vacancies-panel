import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import axios from 'axios';
import VueAxios from 'vue-axios';
import store from './store';
import router from './router';
import firebase from 'firebase';
import Constants from './utils/constants';

Vue.config.productionTip = false;

Vue.use(VueAxios, axios);

Vue.prototype.$bus = new Vue();

const firebaseConfig = {
  apiKey: Constants.apiKey,
  authDomain: Constants.authDomain,
  projectId: Constants.projectId,
  messagingSenderId: Constants.messagingSenderId,
  appId: Constants.appId
};

firebase.initializeApp(firebaseConfig);

new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount('#app')
