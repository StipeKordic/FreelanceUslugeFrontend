// vue.config.js
const path = require('path');

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'vue-carousel$': 'vue-carousel/dist/vue-carousel.css',
      },
    },
  },
};
