<!-- 通用页眉 -->

<style lang="scss" scoped>
  @import './index';
</style>

<template>
  <div id="header_pannel_module">
    <div class="container">
      <section class="left">
        <div class="logo"
          @click="router.push('/efficiency_optimization')">
          <img src="/static/images/logo.png" alt="首页">
          <span class="_txt_l1 _txt_ccc">{{ versionInfo }}</span>
        </div>
      </section>

      <section class="right">

      </section>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      versionInfo: 'Update Time: 2018-01-01 11:56:56',
    };
  }
}
</script>
