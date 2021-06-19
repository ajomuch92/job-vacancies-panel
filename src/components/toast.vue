<template>
  <v-snackbar
    v-model="visible"
    bottom
    left
    :color="color"
    multi-line
    :timeout="timeout"
  >
    {{ text }}
    <v-btn
      dark
      text
      icon
      @click="visible=false"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  name: 'toast',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'success'
    },
    text: {
      type: String,
      default: ''
    },
    timeout: {
      type: [Number, String],
      default: 6000
    }
  },
  computed: {
    color() {
      const types = {
        success: 'success',
        error: 'error',
        warning: 'warning',
      }
      return types[this.type]||'info';
    },
    visible: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      }
    }
  }
}
</script>