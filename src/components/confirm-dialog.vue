<template>
  <v-dialog v-model="value" :max-width="width" persistent >
    <v-card>
      <v-card-title class="title">{{title}}</v-card-title>
      <v-card-text class="pb-0">
        <slot>{{label}}</slot>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="green darken-1" text @click="$emit('yes-button-clicked')">
          {{yesLabel}}
        </v-btn>
        <v-btn color="red darken-1" text @click="$emit('input', false)">
          {{noLabel}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'confirm-dialog',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 350
    },
    title: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    yesLabel: {
      type: String,
      default: 'Yes'
    },
    noLabel: {
      type: String,
      default: 'No'
    }
  },
}
</script>
