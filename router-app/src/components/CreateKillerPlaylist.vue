<template>
  <div class="hello">
    <h1>CREATE KILLER PLAYLIST</h1>

    <form id="example-basic" @submit.prevent="formSubmitted($data)">
      <input type="text" placeholder="Playlist name" v-model="formFields.name">

      <select name="yearpicker" id="yearpicker" v-model="year">
        <option v-for="n in getNumbers()" :value="n">{{ n }}</option>
      </select>

      <input type="submit" value="Submit">
    </form>
  </div>
</template>

<script>
export default {
  name: 'CreateKillerPlaylist',
        data() {
           return {
               accessToken: '',
               formFields: {},
               year: 0,
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
          // TODO - change both to be more accurate? Or maybe this is a BE jobby?
          // currently returns 1953 -> present year - 1
          const startingYear = 1953

          var currentDate = new Date();
          const finishingYear = currentDate.getFullYear()

          return new Array(finishingYear-startingYear).fill(startingYear).map((n,i)=>n+i);
      },
        formSubmitted() {
            var playlistName = this.formFields.name
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
                                            alert(`Playlist: ${playlistName} added to user`)
                                        }
                                    )

                                })
                        })
                })

            // reset values of form fields
            this.formFields = {}
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
