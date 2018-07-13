<style lang="scss" scoped>
  @import './styles/list';
</style>

<template>
  <div id="aftersale_list_module">
    <p v-if="pageType !== 'search'" class="page_remark">注：{{ pageRemark[pageType] }}</p>

    <ul
      v-infinite-scroll="loadMore"
      :infinite-scroll-disabled="canLoad"
      :infinite-scroll-distance="50"
      key="transition-group-fade"
      class="list">
      <router-link
        tag="li"
        :to="{
          path: '/aftersale/details',
          query: {
            returnsId: item.returnsId,
            returnItemId: item.returnItemId,
          }
        }"
        v-for="(item, index) in listForRender"
        :key="index"
        class="list_item">
        <div class="item_header">
          <span class="title pull_left">订单号：{{ item.orderCode || '-' }}</span>
          <span class="id pull_right">退货单号：{{ item.returnsId || '-' }}</span>
        </div>
        <div class="item_content">
          <p>申请退货时间：{{ item._created || '-' }}</p>
          <p>退货原因：{{ item.reasonInfo || '-' }}</p>
          <p>退货数量：{{ item.returnGoodsNum || '-' }}</p>
          <p v-if="pageType === 'search'">
            售后单状态：
            <span :class="{ active: item.status !== 5 }">
              {{ item.statusName || '-' }}
            </span>
            <span v-if="item.status === 1 || item.status === 3">（签收后请在24小时内质检）</span>
            <span v-if="item.status === 6">（请在创建后24小时内审核）</span>
          </p>
        </div>
      </router-link>
    </ul>
    <div class="list_loading">
      {{ canLoad ? '- 加载中 -' : '- 没有更多售后单了 -' }}
      <spinner
        v-show="canLoad"
        color="#fb4b9c"
        :size="28"
        type="double-bounce"></spinner>
    </div>
  </div>
</template>

<script>
import { Spinner } from 'mint-ui';
import { mapState } from 'vuex';
import EventBus from '@/utils/event_bus';

export default {
  data() {
    return {
      curIndex: 0,
      limit: 6,
      loading: false,
      canLoad: true,
      listForRender: [],
    };
  },

  props: {
    searchParams: {
      type: Object,
    },

    pageRemark: {
      required: true,
      type: Object,
    },
  },

  components: { Spinner },

  computed: mapState({
    listObj: state => state.aftersale.listObj,
    pageType: state => state.common.pageType,
  }),

  watch: {
    listObj(val) {
      this.render(val);
    },

    // #0021
    $route: 'init',
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      this.loading = false;

      // #0022
      // 初始化时更新pageType
      // 只为上面的页面注释pageRemark[pageType]，不然会拿不到pageType导致报错
      this.$store.dispatch('updatePageType', this.pageType);

      // 清除渲染数据，缓存位于Store中
      this.listForRender = [];

      // #0023
      // 如果是搜索页面，则需要清掉Store的缓存，重新拉取数据
      if (this.pageType === 'search') {
        this.$store.dispatch('recoverState', { moduleName: 'aftersale', stateName: 'listObj' });
      }

      // 如果当前页面下没有数据，则重新拉取数据
      if (!this.listObj[this.pageType][0].length) {
        // 更新计数
        this.$store.dispatch('getAftersaleCounts');
        this.canLoad = true;
        this.curIndex = 0;
        this.loadMore();
      } else {
        // 通知tabs更新显示计数
        EventBus.$emit('updateTabsCounts');
        // 渲染列表
        this.render(this.listObj);
      }
    },

    render(val) {
      let _list = val[this.pageType];
      this.canLoad = _list.canLoad;
      this.curIndex = _list.curIndex;
      let _listForRender = [];
      for (let i in _list) {
        _listForRender = _listForRender.concat(_list[i]);
      }
      this.listForRender = [].concat(_listForRender);
      this.loading = false;
      this.curIndex += this.limit;
    },

    loadMore() {
      if (this.loading || !this.canLoad) return;
      this.loading = true;

      // 在此定义获取列表基础参数
      let params = {
        pageType: this.pageType,
        start: this.curIndex,
        limit: this.limit,
      };

      switch (this.pageType) {
        case 'preExamineNum':
          params.status = '6';
          break;
        case 'preExpressNum':
          params.status = '8';
          break;
        case 'preSignNum':
          params.status = '9';
          break;
        case 'preQualityNum':
          params.status = '1,3';
          break;
        case 'search':
          Object.assign(params, this.searchParams);
          break;
      }

      this.$store.dispatch('getAftersaleList', params);
    },
  },
};
</script>
