<template>
  <div id="app">
    <v-app>
      <v-content>
        <router-view />
      </v-content>
    </v-app>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#app {
  background-image: url("~@/assets/spotify-theme-music-bkg-dark.png");
  background-size: 100%;
  margin: 0;
}
</style>
