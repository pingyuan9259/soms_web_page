var utils = require('./utils')
var config = require('../config')
var isProduction = process.env.NODE_ENV === 'production'
var autoprefixer = require('autoprefixer');

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: isProduction
      ? config.build.productionSourceMap
      : config.dev.cssSourceMap,
    extract: isProduction
  }),

  postcss: [
    autoprefixer({
      browsers: ['last 5 versions'],
    }),
  ],
}
