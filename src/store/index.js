/* vuex入口
 * 作者：平原
 * 2017-11-20 */

import Vue from 'vue';
import Vuex from 'vuex';

// modules
// 在这里引入模块

// plugins
import { storeHotUpdate } from './plugins';

Vue.use(Vuex);
const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules: {
  },
  plugins: [storeHotUpdate],
  strict: debug,
});
