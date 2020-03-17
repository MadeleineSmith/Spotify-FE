<template>
  <div class="hello">
    <v-btn :href="`${baseURL}/login`">Log in with Spotify</v-btn>
  </div>
</template>

<script>
export default {
  name: 'LoginWithSpotify',
    data () {
      return {
          baseURL: process.env.BASE_URL,
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
