<template>
  <v-container fluid class="d-flex justify-center align-center fill-height">
    <div id="login-container"></div>
  </v-container>
</template>

<script>
import firebase from 'firebase';
import {auth} from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';

export default {
  name: 'Index',
  data: () => ({
    ui: undefined,
    uiConfig: {
      signInSuccessUrl: '#/panel',
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
      ]
    }
  }),
  mounted() {
    this.ui = auth.AuthUI.getInstance();
    if(!this.ui)
      this.ui = new auth.AuthUI(firebase.auth());
    this.ui.start('#login-container', this.uiConfig);
    if(firebase.auth().currentUser) {
      firebase.auth().signOut();
    }
    firebase.auth().onAuthStateChanged(this.handlerAuthUser);
  },
  methods: {
    handlerAuthUser(user) {
      console.log(user);
      if(user) {
        user.getIdToken().then(accessToken => {
          this.$store.commit('setAccessToken', accessToken);
        });
      }
    }
  }
}
</script>

<style scoped>
  @media only screen and (max-width: 600px) {
    #login-container {
      width: 75%;
    }
  }

  @media only screen and (min-width: 600px) {
    #login-container {
      width: 75%;
    }
  }

  @media only screen and (min-width: 768px) {
    #login-container {
      width: 50%;
    }
  }
  
  @media only screen and (min-width: 992px) {
    #login-container {
      width: 25%;
    }
  }

  @media only screen and (min-width: 1200px) {
    #login-container {
      width: 25%;
    }
  }
</style>