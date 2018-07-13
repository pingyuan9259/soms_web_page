<!-- 供应商后台入口
     作者：平原
     创建：2017-12-20 -->

<template>
  <div id="container">
    <header-pannel></header-pannel>
    <div class="wrap">
      <router-view class="wrap_content"></router-view>
    </div>
    
  </div>
</template>

<script>
import HeaderPannel from '@/components/modules/HeaderPannel/';

export default {
  components: {
    HeaderPannel,
  },
};
</script>
