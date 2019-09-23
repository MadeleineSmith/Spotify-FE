<template>
  <div class="hello">
    <h1>CREATE KILLER PLAYLIST</h1>

    <form id="example-basic" @submit.prevent="formSubmitted($data)" >
      <input type="text" placeholder="Playlist name" v-model="formFields.name" :disabled="playlistCreationInProgress">

      <select name="yearpicker" id="yearpicker" v-model="year" :disabled="playlistCreationInProgress">
        <option v-for="n in getNumbers()" :value="n">{{ n }}</option>
      </select>

      <input type="submit" value="Submit" :disabled="playlistCreationInProgress">
      <font-awesome-icon icon="spinner" spin v-show="playlistCreationInProgress"></font-awesome-icon>
    </form>

  </div>
</template>

<script>
    import Vue from 'vue'

    import {library} from '@fortawesome/fontawesome-svg-core'
    import {faSpinner} from '@fortawesome/free-solid-svg-icons'
    import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
    library.add(faSpinner)
    Vue.component('font-awesome-icon', FontAwesomeIcon)

    export default {
  name: 'CreateKillerPlaylist',
        data() {
           return {
               accessToken: '',
               formFields: {},
               year: 0,
               playlistCreationInProgress: false,
           }
        },
    created() {
        // TODO - what happens if for some reason this route param doesn't exist?
        var accessToken = this.$route.params.accessToken

        this.accessToken = accessToken

        this.$http.defaults.headers.common['Authorization'] = accessToken

        // TODO - set base URL as env var
        this.$http.defaults.baseURL = 'http://localhost:6584'

    },
    methods: {
      getNumbers() {
          const startingYear = 1952;

          var currentDate = new Date();
          const finishingYear = currentDate.getFullYear()

          return new Array(finishingYear-startingYear + 1).fill(finishingYear).map((n,i)=>n-i);
      },
        formSubmitted() {
            this.playlistCreationInProgress = true
            var scrapeOfficialChartsURL = `/charts/${this.year}`

            this.$http.post('/user/playlists', this.formFields)
                .then(response => {
                    var playlistID = response.data.id

                    return this.$http.get(scrapeOfficialChartsURL)
                        .then(scrapedData => {
                            var spotifySearchURL = `/search`

                            return this.$http.post(spotifySearchURL, scrapedData.data)
                                .then(completedData => {
                                    var addToPlaylistURL = `/playlists/${playlistID}/tracks`

                                    return this.$http.post(addToPlaylistURL, completedData.data).then(
                                        () => {
                                            alert(`Playlist: ${this.formFields.name} added to user`)
                                            this.playlistCreationInProgress = false
                                            this.formFields = {}
                                        }
                                    )
                                })
                        })
                })
        }
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
  color: #42b983;
}
</style>
