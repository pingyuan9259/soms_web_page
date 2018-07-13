/* vuex全局插件
 * 作者：平原
 * 2017-12-15 */

import _ from 'lodash';

const storeHotUpdate = store => {
  store.hotUpdate({
    mutations: {
      RECOVER_STATE(state, { moduleName, stateName }) {
        state[moduleName][stateName] = Object.assign({}, state.recovery[moduleName][stateName]);
      },
    },

    actions: {
      // 添加初始状态的state镜像，用于恢复以及缓存
      // 由App.vue初始化时调用
      createRecovery() {
        if (!store.recovery) {
          const _state = Object.assign(store.state, {
            recovery: _.cloneDeep(store.state),
          });
          store.replaceState(_state);
        }
      },

      // 恢复状态树
      recoverState({ commit }, params) {
        commit('RECOVER_STATE', params);
      },
    },
  });
};

export {
  storeHotUpdate,
};
