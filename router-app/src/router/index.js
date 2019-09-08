import Vue from 'vue'
import Router from 'vue-router'
import LoginWithSpotify from '@/components/LoginWithSpotify'
import CreateKillerPlaylist from '@/components/CreateKillerPlaylist'
import VueCookies from 'vue-cookies'

Vue.use(Router)

Vue.use(VueCookies)


export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'LoginWithSpotify',
      component: LoginWithSpotify
    },
    {
      path: '/createKillerPlaylist/:accessToken',
      name: 'CreateKillerPlaylist',
      component: CreateKillerPlaylist
    }
  ]
})

// TODO MS 08/09 - Translate pre-existing code into component + figure out how authentication works in Vue
