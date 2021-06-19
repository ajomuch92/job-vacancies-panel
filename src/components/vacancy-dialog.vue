<template>
  <v-dialog v-model="visible" :max-width="width" persistent scrollable>
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ value.id? 'Edit Vacancy': 'Add New Vacancy' }}</span>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-form v-model="valid">
          <v-text-field
            v-model="value.name"
            :rules="requiredRule"
            label="Name"
          ></v-text-field>
          <v-checkbox
            v-if="value.id"
            v-model="value.closed"
            label="Close"
          />
        </v-form>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="red darken-1"
          text
          @click="$emit('cancel-button-click', $event)"
        >
          Cancel
        </v-btn>
        <v-btn
          color="green darken-1"
          text
          @click="save"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: 'vacancy-dialog',
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    visible: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 500
    },
  },
  data: () => ({
    valid: false,
    requiredRule: [
      v => !!v || 'This field is required',
    ],
  }),
  methods: {
    save($event) {
      if(this.valid)
        this.$emit('save-button-click', $event)
    }
  }
}
</script>