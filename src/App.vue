<template>
  <v-app>
    <router-view></router-view>
    <loading :visible="visible" :text="text"/>
    <toast 
      v-for="(toast, key) in toast"
      v-bind="toast"
      v-model="toast.value"
      :style="{marginBottom: `${(toast.length-key-1)*75}px`}"
      :key="key"/>
  </v-app>
</template>

<script>
import loading from './components/loading.vue';
import Toast from './components/toast.vue';

export default {
  name: 'App',
  components: { 
    loading, 
    Toast 
  },
  data: () => ({
    visible: false,
    text: '',
    toast: [],
  }),
  mounted() {
    this.$bus.$on('onDialog', this.onDialogEventHandler);
    this.$bus.$on('onToast', this.onToastHandler);
  },
  methods: {
    onDialogEventHandler(event) {
      if(event) {
        this.text = event;
        this.visible = true;
      } else {
        this.visible = false;
      }
    },
    onToastHandler(event) {
      const {type, text, timeout} = event;
      const toast = {
        value: true,
        type,
        text,
        timeout
      }
      this.toast.push(toast);
    }
  }
};
</script>
