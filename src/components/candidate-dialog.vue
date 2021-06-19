<template>
  <v-dialog v-model="visible" :max-width="width" persistent>
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ value.id? 'Edit Candidate': 'Add New Candidate' }}</span>
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid">
          <v-text-field
            v-model="value.name"
            :rules="requiredRule"
            label="Name"
          ></v-text-field>
          <v-text-field
            v-model="value.surname"
            :rules="requiredRule"
            label="Surname"
          ></v-text-field>
          <v-autocomplete
            label="Time Zone"
            v-model="value.timezone"
            :rules="requiredRule"
            :items="timezones"
            clearable
          ></v-autocomplete>
          <v-text-field
            v-model="value.portfolio_url"
            label="URL portafolio"
          ></v-text-field>
          <v-text-field
            v-model="value.questionnaire_url"
            label="URL questionary"
          ></v-text-field>
          <v-text-field
            v-model="value.github"
            label="GitHub User"
          ></v-text-field>
          <v-text-field
            v-model="value.linkedin"
            label="URL LinkenId"
          ></v-text-field>
          <v-text-field
            v-model="value.description"
            label="Description"
          ></v-text-field>
          <v-autocomplete
            v-if="value.id"
            label="Status"
            v-model="value.status"
            item-text="label"
            item-value="value"
            :items="statuses"
            cache-items
            clearable
          ></v-autocomplete>
        </v-form>
      </v-card-text>

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
import Constants from '../utils/constants';

export default {
  name: 'candidate-dialog',
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
    timezones: [],
    statuses: [
      {label:'New', value: 'new'},
      {label:'Inreview', value: 'inreview'},
      {label:'Reviewed', value: 'reviewed'},
      {label:'Approved', value: 'approved'},
      {label:'Rejected', value: 'rejected'},
      {label:'Hired', value: 'hired'}
    ],
    valid: false,
    requiredRule: [
      v => !!v || 'This field is required',
    ],
    urlRule: [
      v => !!v || 'This is not a valid URL',
    ]
  }),
  created() {
    this.loadTimeZones();
  },
  methods: {
    loadTimeZones() {
      this.$http.get(Constants.timeZoneUrl, {}).then(response => {
        const {status, data, statusText} = response;
        if(status == 200) {
          this.timezones = data||[];
        } else {
          this.$bus.$emit('onToast', {type: 'error', text: statusText});
        }
      }).catch(() => {
          this.$bus.$emit('onToast', {type: 'error', text: 'There was an error during loading timezones'});
      });
    },
    save($event) {
      if(this.valid)
        this.$emit('save-button-click', $event)
    }
  }
}
</script>