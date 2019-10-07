'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"staging"',
  BASE_URL: '"http://spotify-staging.2ryi2nghev.eu-west-1.elasticbeanstalk.com"'
})
