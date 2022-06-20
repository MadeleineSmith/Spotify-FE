<template>
  <div class="log-in-button">
    <v-btn :href="`${baseURL}/login`" color="primary">Log in with Spotify</v-btn>
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

.log-in-button {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
