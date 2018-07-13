<template>
  <div id="tickets_page">
    <header-pannel
      type="common"
      :title="$route.meta.title"
      :subtitle="returnsId">
      <div
        slot="right_btn"
        v-if="$route.path.indexOf('list') > -1"
        class="pull_right">
        <div class="right_btn" @click="$router.push('/aftersale/search?pageType=search')">
          <svg class="icon" aria-hidden="true"><use xlink:href="#icon-search"></use></svg>
        </div>
      </div>  
    </header-pannel>

    <list-tabs
      v-if="$route.path.indexOf('list') > -1"
      :conf="tabsConf"
      theme="btns"
      default="preExamineNum"></list-tabs>

    <transition :name="routeTransType">
      <router-view :page-remark="pageRemark"></router-view>
    </transition>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapState } from 'vuex';
import HeaderPannel from '@/components/common/header_pannel';
import ListTabs from '@/components/common/list_tabs';
import EventBus from '@/utils/event_bus';

export default {
  // 该参数由router传来
  props: ['returnsId'],

  data() {
    return {
      tabsConf: [{
        name: '新建待审核',
        pageType: 'preExamineNum',
        default: true,
      }, {
        name: '待填写快递信息',
        pageType: 'preExpressNum',
      }, {
        name: '待签收',
        pageType: 'preSignNum',
      }, {
        name: '待质检/审核通过',
        pageType: 'preQualityNum',
      }],
      pageRemark: {
        preExamineNum: '新建申请后24小时内不审核则默认可退货',
        preExpressNum: '收到用户退货后，可填写或修改快递信息',
        preSignNum: '收到用户退货后，请设置签收状态',
        preQualityNum: '请在24小时内质检完成，超时自动默认质检通过',
      },
    };
  },

  components: {
    HeaderPannel,
    ListTabs,
  },

  computed: mapState({
    tabsCounts: state => state.aftersale.tabsCounts,
    routeTransType: state => state.common.routeTransType,
  }),

  watch: {
    // 初始化选项卡计数，由./list@init触发
    tabsCounts: 'initTabsCounts',
  },

  created() {
    EventBus.$on('updateTabsCounts', this.initTabsCounts);
  },

  methods: {
    initTabsCounts() {
      let _tabsConf = _.cloneDeep(this.tabsConf);
      for (let i = 0, len = _tabsConf.length; i < len; i++) {
        let _i = _tabsConf[i];
        _i.counts = this.tabsCounts[_i.pageType];
      }
      this.tabsConf = Object.assign([], _tabsConf);
    },
  },
};
</script>
