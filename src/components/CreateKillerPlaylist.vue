<template>
  <div class="hello">
    <h1>Create your playlist</h1>
    <v-row>
      <v-col xs12 sm6 md4>
        <form id="specific-date-form" @submit.prevent="specificDateformSubmitted()">
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

          <input
            type="number"
            min="1952"
            :max="maximumNumYears()"
            v-model.number="formFields.minYear"
          />

          <br />
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

// TODO - consider splitting these out
const formDefaults = {
  date: "2010-03-05",
  minYear: 2010
};

export default {
  name: "CreateKillerPlaylist",
  data(vm) {
    return {
      accessToken: "",
      formFields: { ...formDefaults },
      playlistCreationInProgress: false,
      menu: false,
      dateFormatted: vm.formatDate(formDefaults.date)
    };
  },
  created() {
    // TODO - what happens if for some reason this route param doesn't exist?
    const { accessToken } = this.$route.params;

    this.accessToken = accessToken;

    this.$http.defaults.headers.common.Authorization = accessToken;
  },
  watch: {
    "formFields.date": {
      handler(after, before) {
        this.dateFormatted = this.formatDate(this.formFields.date);
      },
      deep: true
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

      return currentYear;
    },
    specificDateformSubmitted() {
      delete this.formFields.minYear;
      this.formSubmitted();
    },
    minYearFormSubmitted() {
      delete this.formFields.date;
      this.formSubmitted();
    },
    formSubmitted() {
      this.playlistCreationInProgress = true;

      this.$http.post("/user/playlists", this.formFields).then(response => {
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
                  this.formFields = { ...formDefaults };
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
