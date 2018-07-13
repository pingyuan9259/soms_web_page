<!-- 容器组件 -->

<template>
  <div id="app">
    <loading-process></loading-process>
    <transition :name="routeTransType">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import LoadingProcess from '@/components/modules/LoadingProcess/';
import { TOKEN } from '@/config';

export default {
  data() {
    return {
      interval: null,
    };
  },

  components: { LoadingProcess },

  created() {
    // 初始化时验证登录态
    if (TOKEN) {
      this.$store.dispatch('signin');
    }

    // 创建state备份
    this.$store.dispatch('createRecovery');
  },

  watch: {
    // // 监听登录状态变化
    // signStatus(val) {
    //   if (!val || !TOKEN) {
    //     // 非登录状态则重定向到登录页
    //     this.$router.replace('/user/signin');
    //   }
    // },

    // 监听路由来判定使用哪种路由动效
    $route(to, from) {
      const toLevel = to.meta.transLevel;
      const fromLevel = from.meta.transLevel;
      let transName = '';
      if (toLevel > fromLevel) {
        transName = 'slide-left';
      } else if (toLevel === fromLevel) {
        transName = 'fade';
      } else {
        transName = 'slide-right';
      }
      this.$store.dispatch('updateRouteTransType', transName);
    },
  },
};
</script>
