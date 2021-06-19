import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    accessToken: '',
  },
  getters: {
    accessToken: state => state.accessToken,
  },
  mutations: {
    setAccessToken(state, token) {
      state.accessToken = token;
    },
  },
  plugins: [createPersistedState()]
});

export default store;