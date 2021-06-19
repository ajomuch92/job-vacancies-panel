<template>
  <v-container fluid>
    <div class="d-flex">
      <h1>Vacancies</h1>
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
      :items="vacancies"
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
      <template v-slot:item.name={item}>
        {{item.name | capitalizeFirst}}
      </template>
      <template v-slot:item.opened_at={item}>
        {{item.opened_at | formatDate}}
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
      @click="showNewVacancyDialog()"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <confirm-dialog
      v-model="confirmDialog"
      label="Are you sure you want to delete this vacancie?"
      title="Delete Vacancie"
      @yes-button-clicked="deleteVacancy" />
    <vacancy-dialog 
      v-model="newVacancy"
      :visible="dialogVacancy"
      @save-button-click="saveVacancyPreview()"
      @cancel-button-click="dialogVacancy=false"
    />
  </v-container>
</template>

<script>
import confirmDialog from '../../components/confirm-dialog.vue';
import VacancyDialog from '../../components/vacancy-dialog.vue';
import Constants from '../../utils/constants';

export default {
  components: { confirmDialog, VacancyDialog },
  name: 'Candidates',
  data: () => ({
    vacancies: [],
    loadingData: false,
    search: '',
    headers: [
      { text: 'Name', value: 'name' },
      { text: 'Open Since', value: 'opened_at' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    confirmDialog: false,
    selectedVacancy: {},
    newVacancy: {},
    dialogVacancy: false,
  }),
  computed: {
    accessToken() {
      return this.$store.getters.accessToken;
    }
  },
  filters: {
    capitalizeFirst(value) {
      if (!value) return ''
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
    formatDate(date) {
      if (!date) return ''
      date = date.split(' ')[0];
      return date||'';
    }
  },
  created() {
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
      this.$http.get(Constants.baseUrl + 'vacancies', config).then(response => {
        const {status, data, statusText} = response;
        if(status == 200) {
          this.vacancies = data.data||[];
          this.loadingData = false;
        } else {
          this.$bus.$emit('onToast', {type: 'error', text: statusText});
        }
      }).catch(() => {
          this.$bus.$emit('onToast', {type: 'error', text: 'There was an error during loading data'});
      });
    },
    previewDelete(candidate) {
      this.selectedVacancy = candidate;
      this.confirmDialog = true;
    },
    previewEdit(vacancy) {
      this.newVacancy = vacancy;
      this.dialogVacancy = true;
    },
    showNewVacancyDialog() {
      this.newVacancy = {};
      this.dialogVacancy = true;
    },
    deleteVacancy() {
      this.$bus.$emit('onDialog', 'Deleting...');
      const config = {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        }
      }
      this.$http.delete(Constants.baseUrl + `candidates/${this.selectedVacancy.id}`, config).then(response => {
        this.$bus.$emit('onDialog', null);
        const {status, statusText} = response;
        if(status == 204) {
          const index = this.vacancies.findIndex(this.selectedVacancy);
          if(index != -1) 
            this.vacancies.splice(index, 1);
          this.$bus.$emit('onToast', {type: 'success', text: 'Vacancy deleted'});
        } else {
          this.$bus.$emit('onToast', {type: 'error', text: statusText});
        }
      }).catch(() => {
        this.$bus.$emit('onDialog', null);
        this.$bus.$emit('onToast', {type: 'error', text: 'There was an error during deleting candidate'});
      });
    },
    saveVacancyPreview() {
      if(this.newVacancy.id) {
        this.saveVacancyEdit();
      } else {
        this.saveVacancy();
      }
    },
    saveVacancyEdit() {
      this.$bus.$emit('onDialog', 'Saving...');
      const config = {
        data: this.newVacancy,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        }
      }
      this.$http.patch(Constants.baseUrl + `candidates/${this.selectedVacancy.id}`, config).then(response => {
        this.$bus.$emit('onDialog', null);
        const {status, statusText} = response;
        console.log(response);
        if(status == 200) {
          const index = this.vacancies.findIndex(this.selectedVacancy);
          if(index != -1) {
            this.$set(this.vacancies, index, this.newVacancy);
            this.dialogVacancy = false;
            this.newVacancy = {};
            this.$bus.$emit('onToast', {type: 'success', text: 'Candidate updated'});
          }
        } else {
          this.$bus.$emit('onToast', {type: 'error', text: statusText});
          this.dialogVacancy = false;
        }
      }).catch((err) => {
        console.log(err);
        this.dialogVacancy = false;
        this.$bus.$emit('onDialog', null);
        this.$bus.$emit('onToast', {type: 'error', text: 'There was an error during deleting candidate'});
      });
    },
    saveVacancy() {
      this.$bus.$emit('onDialog', 'Saving...');
      const config = {
        data: this.newVacancy,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        }
      }
      this.$http.post(Constants.baseUrl + 'vacancies', config).then(response => {
        this.$bus.$emit('onDialog', null);
        const {status, statusText} = response;
        console.log(response);
        if(status == 200) {
          this.vacancies.push(this.newVacancy);
          this.newVacancy = {};
          this.$bus.$emit('onToast', {type: 'success', text: 'Candidate added'});
        } else {
          this.$bus.$emit('onToast', {type: 'error', text: statusText});
          this.dialogVacancy = false;
        }
      }).catch(() => {
        this.dialogVacancy = false;
        this.$bus.$emit('onDialog', null);
        this.$bus.$emit('onToast', {type: 'error', text: 'There was an error during deleting candidate'});
      });
    }
  }
}
</script>

<style>

</style>