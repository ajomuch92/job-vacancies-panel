<template>
  <v-container fluid>
    <div class="d-flex">
      <h1>Candidates</h1>
      <v-spacer />
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
        dense
        outlined
      />
    </div>
    <v-data-table
      :headers="headers"
      :items="candidates"
      :search="search"
      :loading="loadingData"
    >
      <template v-slot:item.actions={item}>
        <v-icon
          small
          class="mr-2"
          @click="previewEdit(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="previewDelete(item)"
        >
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:item.linkedin={item}>
        <v-btn
          icon
          dark
          color="#0A66C2"
          small
          @click="openInNewTab(item.linkedin)"
        >
          <v-icon dark>
            mdi-linkedin
          </v-icon>
        </v-btn>
      </template>
      <template v-slot:item.questionnaire_url={item}>
        <v-btn
          icon
          dark
          color="blue"
          small
          @click="openInNewTab(item.questionnaire_url)"
        >
          <v-icon dark>
            mdi-head-question
          </v-icon>
        </v-btn>
      </template>
      <template v-slot:item.portfolio_url={item}>
        <v-btn
          icon
          dark
          color="green"
          small
          @click="openInNewTab(item.portfolio_url)"
        >
          <v-icon dark>
            mdi-web-box
          </v-icon>
        </v-btn>
      </template>
      <template v-slot:item.status={item}>
        <v-chip
          :color="getColor(item.status)"
          dark
        >
          {{ item.status | capitalizeFirst}}
        </v-chip>
      </template>
    </v-data-table>
    <v-btn
      elevation="0"
      fab
      dark
      fixed
      bottom
      right
      color="pink"
      @click="showNewCandidateDialog()"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <confirm-dialog
      v-model="confirmDialog"
      label="Are you sure you want to delete this candidate?"
      title="Delete Candidate"
      @yes-button-clicked="deleteCandidate" />
    <candidate-dialog
      v-model="newCandidate"
      :visible="dialogCandidate"
      @save-button-click="saveCandidatePreview()"
      @cancel-button-click="dialogCandidate=false"/>
  </v-container>
</template>

<script>
import CandidateDialog from '../../components/candidate-dialog.vue';
import confirmDialog from '../../components/confirm-dialog.vue';
import Constants from '../../utils/constants';

export default {
  components: { confirmDialog, CandidateDialog },
  name: 'Candidates',
  data: () => ({
    candidates: [],
    loadingData: false,
    search: '',
    headers: [
      { text: 'Name', value: 'name' },
      { text: 'Surname', value: 'surname' },
      { text: 'Timezone', value: 'timezone' },
      { text: 'Portafolio', value: 'portfolio_url' },
      { text: 'Questionary', value: 'questionnaire_url' },
      { text: 'Github User', value: 'github' },
      { text: 'Linkedin', value: 'linkedin' },
      { text: 'Status', value: 'status' },
      { text: 'Description', value: 'description' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    confirmDialog: false,
    selectedCandidate: {},
    newCandidate: {},
    dialogCandidate: false,
  }),
  filters: {
    capitalizeFirst(value) {
      if (!value) return ''
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  },
  computed: {
    accessToken() {
      return this.$store.getters.accessToken;
    }
  },
  watch: {
    accessToken(val) {
      if(val) {
        this.loadData();
      }
    }
  },
  created() {
    if(this.accessToken)
      this.loadData();
  },
  methods: {
    loadData() {
      this.loadingData = true;
      const config = {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        }
      }
      this.$http.get(Constants.baseUrl + 'candidates', config).then(response => {
        const {status, data, statusText} = response;
        if(status == 200) {
          this.candidates = data.data||[];
          this.loadingData = false;
        } else {
          this.$bus.$emit('onToast', {type: 'error', text: statusText});
        }
      }).catch(() => {
          this.$bus.$emit('onToast', {type: 'error', text: 'There was an error during loading data'});
      });
    },
    openInNewTab(url) {
      if(url)
        window.open(url, '_blank').focus();
    },
    getColor(status) {
      const colors = {
        'new': 'green',
        'reviewed': 'orange',
        'inreview': 'purple',
        'approved': 'yellow',
        'rejected': 'red',
        'hired': 'pink'
      }
      return colors[status]||'black';
    },
    previewDelete(candidate) {
      this.selectedCandidate = candidate;
      this.confirmDialog = true;
    },
    previewEdit(candidate) {
      this.newCandidate = candidate;
      this.dialogCandidate = true;
    },
    showNewCandidateDialog() {
      this.newCandidate = {};
      this.dialogCandidate = true;
    },
    deleteCandidate() {
      this.$bus.$emit('onDialog', 'Deleting...');
      const config = {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        }
      }
      this.$http.delete(Constants.baseUrl + `candidates/${this.selectedCandidate.id}`, config).then(response => {
        this.$bus.$emit('onDialog', null);
        const {status, statusText} = response;
        if(status == 204) {
          const index = this.candidates.findIndex(this.selectedCandidate);
          if(index != -1) 
            this.candidates.splice(index, 1);
          this.$bus.$emit('onToast', {type: 'success', text: 'Candidate deleted'});
        } else {
          this.$bus.$emit('onToast', {type: 'error', text: statusText});
        }
      }).catch(() => {
        this.$bus.$emit('onDialog', null);
        this.$bus.$emit('onToast', {type: 'error', text: 'There was an error during deleting candidate'});
      });
    },
    saveCandidatePreview() {
      if(this.newCandidate.id) {
        this.saveCandidateEdit();
      } else {
        this.saveCandidate();
      }
    },
    saveCandidateEdit() {
      this.$bus.$emit('onDialog', 'Saving...');
      const config = {
        data: this.newCandidate,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        }
      }
      this.$http.patch(Constants.baseUrl + `candidates/${this.selectedCandidate.id}`, config).then(response => {
        this.$bus.$emit('onDialog', null);
        const {status, statusText} = response;
        console.log(response);
        if(status == 200) {
          const index = this.candidates.findIndex(this.selectedCandidate);
          if(index != -1) {
            this.$set(this.candidates, index, this.newCandidate);
            this.dialogCandidate = false;
            this.newCandidate = {};
            this.$bus.$emit('onToast', {type: 'success', text: 'Candidate updated'});
          }
        } else {
          this.$bus.$emit('onToast', {type: 'error', text: statusText});
          this.dialogCandidate = false;
        }
      }).catch((err) => {
        console.log(err);
        this.dialogCandidate = false;
        this.$bus.$emit('onDialog', null);
        this.$bus.$emit('onToast', {type: 'error', text: 'There was an error during deleting candidate'});
      });
    },
    saveCandidate() {
      this.$bus.$emit('onDialog', 'Saving...');
      const config = {
        data: this.newCandidate,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        }
      }
      this.$http.post(Constants.baseUrl + 'candidates', config).then(response => {
        this.$bus.$emit('onDialog', null);
        const {status, statusText} = response;
        console.log(response);
        if(status == 200) {
          this.candidates.push(this.newCandidate);
          this.newCandidate = {};
          this.$bus.$emit('onToast', {type: 'success', text: 'Candidate added'});
        } else {
          this.$bus.$emit('onToast', {type: 'error', text: statusText});
          this.dialogCandidate = false;
        }
      }).catch(() => {
        this.dialogCandidate = false;
        this.$bus.$emit('onDialog', null);
        this.$bus.$emit('onToast', {type: 'error', text: 'There was an error during deleting candidate'});
      });
    }
  }
}
</script>

<style>

</style>