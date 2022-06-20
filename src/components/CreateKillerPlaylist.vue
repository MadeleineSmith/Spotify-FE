<template>
  <div class="hello">
    <h1 class="white--text">Create a Spotify playlist from UK chart data</h1>

    <p class="white--text">
      Explore chart data here:
      <a
        href="https://www.officialcharts.com/charts/"
        target="_blank"
      >Official Charts</a>
    </p>

    <v-snackbar v-model="showSnackbar" :timeout="timeout" top="top">
      <a :href="snackbarHref" target="_blank" @click="showSnackbar = false">Open playlist</a>
      <v-btn color="blue" @click="showSnackbar = false">Close</v-btn>
    </v-snackbar>

    <v-container fluid grid-list-md>
      <v-layout row wrap justify-center="true">
        <v-flex xs12 sm5 md3 lg3 xl2>
          <v-form id="example-basic" @submit.prevent="yearFormSubmitted()">
            <v-card>
              <label for="yearpicker">Randomise a chart since:</label>
              <v-menu
                ref="yearMenu"
                :close-on-content-click="true"
                v-model="yearMenu"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="minYear"
                    label="Year"
                    prepend-icon="event"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>

                <v-date-picker
                  reactive
                  show-current
                  ref="picker"
                  v-model="minYear"
                  min="1952-NaN-NaN"
                  :max="maximumNumYears()"
                  no-title
                ></v-date-picker>
              </v-menu>

              <v-btn
                class="mr-4"
                type="submit"
                :disabled="playlistCreationInProgress"
                color="primary"
              >submit</v-btn>
              <font-awesome-icon icon="spinner" spin v-show="showYearSpinner"></font-awesome-icon>
            </v-card>
          </v-form>
        </v-flex>

        <v-flex xs12 sm5 md3 lg3 xl2>
          <v-form id="specific-date-form" @submit.prevent="specificDateFormSubmitted()">
            <v-card>
              <label>Create a chart on:</label>

              <v-menu
                v-model="specificDateMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="dateFormatted"
                    label="Specific date"
                    prepend-icon="event"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>

                <v-date-picker
                  v-model="formFields.date"
                  @input="specificDateMenu = false"
                  ref="specificDatePicker"
                  min="1952-11-14"
                  :max="maximumDate()"
                ></v-date-picker>
              </v-menu>

              <v-btn
                class="mr-4"
                type="submit"
                :disabled="playlistCreationInProgress"
                color="primary"
              >submit</v-btn>
              <font-awesome-icon icon="spinner" spin v-show="showSpecificDateSpinner"></font-awesome-icon>
            </v-card>
          </v-form>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import Vue from "vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faSpinner);
Vue.component("font-awesome-icon", FontAwesomeIcon);

const defaultDate = "2010-03-05";
const defaultMinYear = "2010-NaN-NaN";

export default {
  name: "CreateKillerPlaylist",
  data(vm) {
    return {
      accessToken: "",
      formFields: {
        date: defaultDate
      },
      playlistCreationInProgress: false,
      specificDateMenu: false,
      yearMenu: false,
      dateFormatted: vm.formatDate(defaultDate),
      timeout: 0,
      showSnackbar: false,
      snackbarHref: "",
      showSpecificDateSpinner: false,
      showYearSpinner: false
    };
  },
  created() {
    // TODO - what happens if for some reason this route param doesn't exist?
    const { accessToken } = this.$route.params;

    this.accessToken = accessToken;

    this.$http.defaults.headers.common.Authorization = accessToken;

    this.minYear = defaultMinYear;
  },
  watch: {
    "formFields.date": {
      handler(after, before) {
        this.dateFormatted = this.formatDate(this.formFields.date);
      },
      deep: true
    },
    yearMenu(val) {
      val && this.$nextTick(() => (this.$refs.picker.activePicker = "YEAR"));
    },
    specificDateMenu(val) {
      val &&
        setTimeout(() => (this.$refs.specificDatePicker.activePicker = "YEAR"));
    }
  },
  computed: {
    minYear: {
      get() {
        return this.$store.state.yearNav.yyyy;
      },
      set(newValue) {
        this.$store.commit("yearNav/change", newValue.slice(0, -8));
      }
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    maximumDate() {
      let today = new Date();
      let dd = today.getDate();
      let mm = today.getMonth() + 1; // January is 0!
      const yyyy = today.getFullYear();
      if (dd < 10) {
        dd = `0${dd}`;
      }
      if (mm < 10) {
        mm = `0${mm}`;
      }

      today = `${yyyy}-${mm}-${dd}`;

      return today;
    },
    maximumNumYears() {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();

      const maximumNumYearsString = `${currentYear}-NaN-NaN`;

      return maximumNumYearsString;
    },
    yearFormSubmitted() {
      this.showYearSpinner = true;
      const minYear = parseInt(this.minYear);

      const json = {
        minYear
      };

      this.formSubmitted(json);
    },
    specificDateFormSubmitted() {
      this.showSpecificDateSpinner = true;

      const json = {
        date: this.formFields.date
      };

      this.formSubmitted(json);
    },
    resetForms() {
      this.playlistCreationInProgress = false;
      this.showSpecificDateSpinner = false;
      this.showYearSpinner = false;

      this.formFields.date = defaultDate;
      this.minYear = defaultMinYear;
    },
    formSubmitted(json) {
      this.playlistCreationInProgress = true;
      this.showSnackbar = false;

      this.$http.post("/user/playlists", json).then(response => {
        const playlistID = response.data.id;
        const dateString = response.data.date;

        const scrapeOfficialChartsURL = `/charts/${dateString}`;

        return this.$http.get(scrapeOfficialChartsURL).then(scrapedData => {
          const spotifySearchURL = "/search";

          return this.$http
            .post(spotifySearchURL, scrapedData.data)
            .then(completedData => {
              const addToPlaylistURL = `/playlists/${playlistID}/tracks`;

              return this.$http
                .post(addToPlaylistURL, completedData.data)
                .then(() => {
                  this.snackbarHref = `https://open.spotify.com/playlist/${playlistID}`;
                  this.showSnackbar = true;

                  this.resetForms();
                });
            });
        });
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
  color: #42b983;
}
</style>
