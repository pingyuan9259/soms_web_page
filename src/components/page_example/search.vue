<!-- 订单售后搜索
     作者：平原
     创建：2017-11-27
     优化：2017-12-15 -->

<style lang="scss" scoped>
  @import './styles/search';
</style>

<template>
  <div id="search_module">

    <!-- 搜索放大镜按钮 -->
    <transition name="fade">
      <a v-show="!openSearch" @click="searchDashborad(true)" class="open_search">
        <svg class="icon" aria-hidden="true"><use xlink:href="#icon-search"></use></svg>
      </a>
    </transition>

    <transition name="fade">
    <div v-show="openSearch" class="search_container">
      <div class="search_dict">
        <date-range :date-picker-value.sync="datePickerValue"></date-range>

        <label>售后单ID</label>
        <div class="input">
          <input
            @input="watchParamsChange"
            @propertychange="watchParamsChange"
            v-model="searchParams.returnsId"
            type="number" class="end">
        </div>

        <label>订单号</label>
        <div class="input">
          <input
            @input="watchParamsChange"
            @propertychange="watchParamsChange"
            v-model="searchParams.orderCode"
            type="number" class="end">
        </div>

        <label>收货人手机号</label>
        <div class="input">
          <input
            @input="watchParamsChange"
            @propertychange="watchParamsChange"
            v-model="searchParams.receiverPhone"
            type="number" class="end">
        </div>

        <label>收货人姓名</label>
        <div class="input">
          <input
            @input="watchParamsChange"
            @propertychange="watchParamsChange"
            v-model="searchParams.receiverName"
            type="text" class="end">
        </div>

        <label>快递单号</label>
        <div class="input">
          <input
            @input="watchParamsChange"
            @propertychange="watchParamsChange"
            v-model="searchParams.sheetCode"
            type="text" class="end">
        </div>
      </div>

      <div class="search_btn">
        <a
          @click="search()"
          @keyup.enter="search()"
          :btnDisabled="!canSearch"
          class="btn_l">搜索</a>
      </div>
    </div>
    </transition>

    <tickets-list v-if="!openSearch && showResList" :search-params="_searchParams"></tickets-list>
  </div>
</template>

<script>
import DateRange from './modules/date_range';
import TicketsList from './list';
import { apiQueryFilter } from '@/config/filter';

export default {
  data() {
    return {
      // 用于搜索的参数集合
      searchParams: {
        startTime: '',
        endTime: '',
        returnsId: '',
        orderCode: '',
        receiverPhone: '',
        receiverName: '',
        sheetCode: '',
        parseTime: '',
      },
      _searchParams: {}, // 经过滤后的参数集合
      hasResult: false, // 存在搜索结果则在搜索面板中显示[收起]按钮
      showResList: false, // 显示搜索结果列表
      canSearch: false, // 是否点亮[搜索]按钮
      openSearch: true, // 展开搜索面板

      datePickerValue: {}, // 用于日期选择组件prop.sync回传
    };
  },

  watch: {
    // 监听日期选择组件的参数回传
    datePickerValue(val) {
      for (let key in val) {
        if (val[key] !== '') {
          this.searchParams[key] = val[key];
          this.searchParams.parseTime = true;
        }
      }
      this.watchParamsChange();
    },
  },

  components: {
    DateRange,
    TicketsList,
  },

  created() {
    // 初始化时更新pageType
    this.$store.dispatch('updatePageType', this.$route.query.pageType);
  },

  methods: {
    // 搜索
    search() {
      if (!this.canSearch) return;

      // 过滤掉请求参数中的空属性
      this._searchParams = apiQueryFilter(this.searchParams);
      this.hasResult = true;
      this.openSearch = false;
      this.showResList = true;
    },

    // 监听参数的变动
    // 如果参数中有值，则点亮[搜索]按钮
    watchParamsChange() {
      let hasContent = false;
      for (let key in this.searchParams) {
        if (this.searchParams[key] !== '') {
          hasContent = true;
          break;
        }
      }
      this.canSearch = hasContent;
    },

    // 展开与关闭搜索面板
    searchDashborad(status) {
      this.openSearch = status;
      document.body.scrollTop = 0;
    },
  },
};
</script>
