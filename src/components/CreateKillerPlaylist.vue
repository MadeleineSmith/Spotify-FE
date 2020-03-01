<template>
  <div class="hello">
    <h1>Create your playlist</h1>

    <form id="specific-date-form" @submit.prevent="specificDateformSubmitted()" >
      <label>Create a chart on:</label>
      
      <input type="date" id="dateField"  v-model="formFields.date" min="1952-11-14" :max="maximumDate()">
    
      <input type="submit" value="Submit" :disabled="playlistCreationInProgress">
      <font-awesome-icon icon="spinner" spin v-show="playlistCreationInProgress"></font-awesome-icon>
    </form>

    <hr>

    <form id="example-basic" @submit.prevent="minYearFormSubmitted()" >
    
      <label for="yearpicker">Randomise a chart since:</label>

      <input type="number" min=1952 :max="maximumNumYears()" v-model.number="formFields.minYear">

      <br>
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

    const formDefaults = {
                 "date": "2010-01-01",
                 "minYear": 2010
               }

    export default {
  name: 'CreateKillerPlaylist',
        data() {
           return {
               accessToken: '',
               formFields: Object.assign({}, formDefaults),
               playlistCreationInProgress: false,
           }
        },
    created() {
        // TODO - what happens if for some reason this route param doesn't exist?
        var accessToken = this.$route.params.accessToken

        this.accessToken = accessToken

        this.$http.defaults.headers.common['Authorization'] = accessToken

    },
    methods: {
      maximumDate() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd
        } 
        if(mm<10){
            mm='0'+mm
        } 

        today = yyyy+'-'+mm+'-'+dd;

        return today
    },
      maximumNumYears() {
          var currentDate = new Date();
          const currentYear = currentDate.getFullYear()

          return currentYear
      },
      specificDateformSubmitted() {
        delete this.formFields.minYear
        this.formSubmitted()
      },
      minYearFormSubmitted() {
        delete this.formFields.date
        this.formSubmitted()
      },
        formSubmitted() {
            this.playlistCreationInProgress = true
            
            this.$http.post('/user/playlists', this.formFields)
                .then(response => {
                    var playlistID = response.data.id
                    var dateString = response.data.date
                  
                    var scrapeOfficialChartsURL = `/charts/${dateString}`

                    return this.$http.get(scrapeOfficialChartsURL)
                        .then(scrapedData => {
                            var spotifySearchURL = `/search`

                            return this.$http.post(spotifySearchURL, scrapedData.data)
                                .then(completedData => {
                                    var addToPlaylistURL = `/playlists/${playlistID}/tracks`

                                    return this.$http.post(addToPlaylistURL, completedData.data).then(
                                        () => {
                                            alert(`Playlist of ${dateString} added to user`)
                                            this.playlistCreationInProgress = false
                                            this.formFields = Object.assign({}, formDefaults)
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
