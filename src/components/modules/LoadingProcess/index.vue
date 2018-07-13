<!-- 加载进度条 -->

<style lang="scss" scoped>
  @import './index';
</style>

<template>
  <transition name="fade">
  <div
    v-if="isShow"
    :style="{ width: val + '%' }"
    class="loading_process_module"></div>
  </transition>
</template>

<script type="text/babel">
import EventBus from '@/utils/event_bus';

export default {
  data() {
    return {
      isShow: true, // 是否显示进度条
      step: 2, // 自增幅度
      slowVal: 50, // 到一定进度速度放缓
      stopVal: 90, // 到一定进度停止
      val: 0, // 进度
      timer: null, // 定时器
    };
  },

  watch: {
    $route: 'routerChange',
  },

  created() {
    EventBus.$on('loadingProcess', () => {
      this.init();

      // 初始化后加载进度，加载到百分之多少由stopVal决定
      this.timer = setInterval(() => {
        this.val += this.step;
        // 父组件数据加载完前进度条最多到stopVal的这个百分值
        if (this.val > this.slowVal) {
          clearInterval(this.timer);
          this.interval = 200;
          this.step = 1;
          this.timer = setInterval(() => {
            this.val += this.step;
            if (this.val > this.stopVal) {
              clearInterval(this.timer);
              return;
            }
          }, 200);
        }
      }, 30);
    });
  },

  methods: {
    init() {
      this.isShow = true;
      this.val = 0;
      this.step = 2;
      clearTimeout(this.timer);
    },

    routerChange() {
      clearInterval(this.timer);
      this.val = 100;
      this.timer = setTimeout(() => {
        this.isShow = false;
        clearTimeout(this.timer);
      }, 50);
    },
  },
};
</script>
