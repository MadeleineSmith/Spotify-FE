<template>
  <div class="hello">
    <h1>Create your playlist</h1>

    <p>
      Explore chart history here:
      <a
        href="https://www.officialcharts.com/charts/"
        target="_blank"
      >Official Charts</a>
    </p>

    <v-row>
      <v-col xs12 sm6 md4>
        <form id="specific-date-form" @submit.prevent="specificDateFormSubmitted()">
          <label>Create a chart on:</label>

          <v-menu
            v-model="menu"
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
              @input="menu = false"
              min="1952-11-14"
              :max="maximumDate()"
            ></v-date-picker>
          </v-menu>

          <input type="submit" value="Submit" :disabled="playlistCreationInProgress" />
          <font-awesome-icon icon="spinner" spin v-show="playlistCreationInProgress"></font-awesome-icon>
        </form>
      </v-col>

      <v-col xs12 sm6 md4>
        <form id="example-basic" @submit.prevent="minYearFormSubmitted()">
          <label for="yearpicker">Randomise a chart since:</label>
          <v-flex xs10>
            <v-menu
              ref="menu2"
              :close-on-content-click="true"
              v-model="menu2"
              :nudge-right="40"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field v-model="minYear" label="Year" prepend-icon="event" readonly v-on="on"></v-text-field>
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
          </v-flex>

          <input type="submit" value="Submit" :disabled="playlistCreationInProgress" />
          <font-awesome-icon icon="spinner" spin v-show="playlistCreationInProgress"></font-awesome-icon>
        </form>
      </v-col>
    </v-row>
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
        date: defaultDate,
      },
      playlistCreationInProgress: false,
      menu: false,
      dateFormatted: vm.formatDate(defaultDate),
      menu2: false,
      modal: false
    };
  },
  created() {
    // TODO - what happens if for some reason this route param doesn't exist?
    const { accessToken } = this.$route.params;

    this.accessToken = accessToken;

    this.$http.defaults.headers.common.Authorization = accessToken;

    this.minYear = defaultMinYear
  },
  watch: {
    "formFields.date": {
      handler(after, before) {
        this.dateFormatted = this.formatDate(this.formFields.date);
      },
      deep: true
    },
    menu2(val) {
      val && this.$nextTick(() => (this.$refs.picker.activePicker = "YEAR"));
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
    specificDateFormSubmitted() {
      const json = {
        date: this.formFields.date
      };

      this.formSubmitted(json);
    },
    minYearFormSubmitted() {
      const minYear = parseInt(this.minYear);

      const json = {
        minYear: minYear
      };

      this.formSubmitted(json);
    },
    formSubmitted(json) {
      this.playlistCreationInProgress = true;

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
                  alert(`Playlist of ${dateString} added to user`);
                  this.playlistCreationInProgress = false;

                  this.formFields.date = defaultDate;
                  this.formFields.minYear = defaultMinYear;
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
