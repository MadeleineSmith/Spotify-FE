<template>
  <div class="hello">
    <h1>CREATE KILLER PLAYLIST</h1>

    <form id="example-basic">
      <input id="playlist-name" type="text" name="playlistName" placeholder="Playlist name">

      <select name="yearpicker" id="yearpicker">
        <option v-for="n in getNumbers()" :value="n">{{ n }}</option>
      </select>

      <input type="submit" value="Submit">
    </form>
  </div>
</template>

<script>
export default {
  name: 'CreateKillerPlaylist',
    created() {
        // what happens if for some reason this route param doesn't exist?
        this.$cookies.set("access_token", this.$route.params.accessToken)
    },
    methods: {
      getNumbers() {
          // TODO - change both to be more accurate? Or maybe this is a BE jobby?
          // currently returns 1953 -> present year - 1
          const startingYear = 1953

          var currentDate = new Date();
          const finishingYear = currentDate.getFullYear()

          return new Array(finishingYear-startingYear).fill(startingYear).map((n,i)=>n+i);
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


// when hit this component:
// get the access token from the URL
// set it in a cookie
// use the cookie when making the requests
