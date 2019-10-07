<template>
  <div class="hello">
    <a :href="`${baseURL}/login`" class="btn btn-primary">Log in with Spotify</a>
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
