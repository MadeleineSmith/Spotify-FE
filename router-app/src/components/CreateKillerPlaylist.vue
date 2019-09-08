<template>
  <div class="hello">
    <h1>CREATE KILLER PLAYLIST</h1>
  </div>
</template>

<script>
export default {
  name: 'CreateKillerPlaylist',
    created() {
        // what happens if for some reason this route param doesn't exist?
        this.$cookies.set("access_token", this.$route.params.accessToken)
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
