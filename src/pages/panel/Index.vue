<template>
  <div id="panel-container">
    <v-overlay :value="drawer" z-index="4">
    </v-overlay>
    <v-navigation-drawer v-model="drawer"
      app
      clipped
      hide-overlay
      temporary
      :style="{ top: $vuetify.application.top + 'px', zIndex: 6 }"
    >
      <v-list
        nav
        dense
      >
      <v-list-item-group
        v-model="selectedRouteIndex"
        color="primary"
      >
        <v-list-item v-for="(item, key) in drawerItems" :key="key" link :href="item.href">
          <v-list-item-content>
            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item-content>
          <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left flat dark dense color="blue" >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer />
      <v-btn
        icon
        dark
        @click="logout"
      >
        <v-icon dark>
          mdi-logout-variant 
        </v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import firebase from 'firebase';

export default {
  name: 'Panel',
  data: () => ({
    drawer: false,
    selectedRouteIndex: 0,
    drawerItems: [
      { text: 'Candidates', icon: 'mdi-account-group', href: '#/panel' },
      { text: 'Vacancies', icon: 'mdi-package', href: '#/vacancies' },
    ]
  }),
  methods: {
    logout() {
      firebase.auth().signOut();
      this.$store.commit('setAccessToken', '');
      this.$router.push('/');
    }
  }
}
</script>

<style>

</style>