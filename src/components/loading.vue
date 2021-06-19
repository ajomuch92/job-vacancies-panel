<template>
  <v-dialog v-model="visible" width="150" persistent no-click-animation>
    <v-card flat outlined class="d-flex flex-column justicy-center align-center">
      <v-progress-circular
        class="mt-2"
        indeterminate
        :size="38"
        :width="2"
        color="light-blue"
      ></v-progress-circular>
      <p class="mb-0">{{text||'Loading...'}}</p>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    text: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
  }
}
</script>