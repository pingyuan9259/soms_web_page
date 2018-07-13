<!-- 售后单详情快递信息
     作者：平原
     创建：2017-12-06 -->

<style lang="scss" scoped>
  @import '../styles/details_express_info';
</style>

<template>
  <div id="details_express_info_module">
    <h3 class="_title">退货物流</h3>

    <div class="content">
      <!-- 仅在'签收'页面显示info -->
      <div v-if="!showEditor" class="info">
        <p class="_content">快递公司：{{ details.expressCompanyName || '-' }}</p>
        <p class="_content">
          快递单号：{{ details.sheetCode || '-' }}

          <!-- 已签收标记 -->
          <span v-if="isReceive" class="receive_sign">（已签收）</span>
        </p>
      </div>

      <div v-else class="editorInfo">
        <p class="express _content mb20">
          <span class="_content pull_left">退货公司：</span>
          <a
            v-if="express"
            @click="openExpressList"
            class="btn_label">{{ express }}</a>
          <a
            @click="openExpressList"
            class="_btn_hollow_xs">
            <span>{{ express ? '换快递' : '选择快递' }}</span>
          </a>
        </p>

        <p class="_content mb20">
          快递单号：
          <input
            v-model="expressSheetCode"
            type="number">
        </p>
      </div>

      <!-- ‘新建快递信息’页面显示[保存] -->
      <div v-if="details.status === 8" class="pre_option">
        <a
          @click="saveExpress"
          class="_btn_hollow_xs ml130"><span>保存</span></a>
      </div>

      <!-- '签收'页面显示[修改快递][确认签收] -->
      <div v-else-if="!isReceive" class="option">
        <a
          @click="saveExpress"
          class="_btn_hollow_xs">
          <span>{{ showEditor ? '保存' : '修改快递' }}</span>
        </a>
        <a
          @click="confirmReceive"
          class="_btn_hollow_xs">
          <span>确认签收</span>
        </a>
      </div>
    </div>

    <popup-list
      :show="showExpressList"
      :list="expressList"
      :result.sync="expressSync"></popup-list>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import PopupList from '@/components/common/popup_list';
import Toast from '@/components/common/toast';
import { MessageBox } from 'mint-ui';
import _putEditExpressInfo from '@/apis/aftersale/put_edit_express_info';
import _putConfirmReceive from '@/apis/aftersale/put_confirm_receive';

export default {
  props: ['details'],

  data() {
    return {
      // 快递信息相关
      isLoading: false,
      showExpressList: false,
      express: '', // 快递公司名称
      expressId: '', // 快递公司id
      expressSheetCode: '',
      expressSync: {},

      showEditor: false,
      isReceive: false, // 是否已经签收
      returnItemId: this.$route.query.returnItemId,
    };
  },

  components: { PopupList },

  computed: mapState({
    expressList: state => state.common.expressList,
    pageType: state => state.common.pageType,
  }),

  watch: {
    expressSync(val) {
      if (val.id) {
        this.expressId = val.id;
        this.express = val.name;
      }
      this.showExpressList = false;
    },

    details(val) {
      this.init();
    },
  },

  created() {
    this.init();
  },

  methods: {
    // 初始化
    init() {
      // 如果是‘待填写快递信息’页面，则初始显示快递信息编辑栏
      this.showEditor = this.details.status === 8;
      this.expressId = this.details.expressId;
      this.isReceive = this.details.isConfirmReceipt;
    },

    // 展开快递选择列表
    async openExpressList() {
      // 节流，防止重复多次请求
      if (this.isLoading) return;
      this.isLoading = true;

      // 如果网络缓慢，则显示加载中Toast
      Toast('open', {
        message: '加载中...',
        position: 'bottom',
        delay: 500,
      });

      // 获取快递公司列表
      await this.$store.dispatch('getExpressList');

      // 接口返回时关闭Toast
      Toast('close');
      this.isLoading = false;
      this.showExpressList = true;
    },

    // 保存快递信息
    async saveExpress() {
      // 如果是非编辑状态下则打开编辑信息
      if (!this.showEditor) {
        this.express = this.details.expressCompanyName;
        this.expressSheetCode = this.details.sheetCode;
        this.showEditor = true;
        return;
      }

      if (!this.expressId) {
        MessageBox.alert('请选择快递公司');
        return;
      } else if (!this.expressSheetCode) {
        MessageBox.alert('请输入快递单号');
        return;
      }

      try {
        await _putEditExpressInfo({
          expressId: this.expressId,
          expressNum: this.expressSheetCode,
          returnItemId: this.returnItemId,
        });
        Toast('open', { message: '保存成功', position: 'bottom', duration: 2000 });
        this.showEditor = false;
        // 提交快递信息后重新拉去详情信息(详情信息初始化在../details.vue)
        this.$store.dispatch('getAftersaleDetails', this.returnItemId);
        // 如果页面类型是待填写快递信息，那么列表存在更新，清理state的list缓存
        if (this.pageType === 'preExpressNum') {
          this.$store.dispatch('recoverState', { moduleName: 'aftersale', stateName: 'listObj' });
        }
      } catch (err) {
        Toast('open', { message: '保存失败', position: 'bottom', duration: 2000 });
        console.error('aftersale/details_express_info.vue@saveExpress >>>>>', err);
      }
    },

    // 确认签收
    async confirmReceive() {
      try {
        await _putConfirmReceive(this.returnItemId);
        this.isReceive = true;
        Toast('open', { message: '签收成功', position: 'bottom', duration: 2000 });
        this.$store.dispatch('getAftersaleDetails', this.returnItemId);
        // 列表数据存在更新，清理state的list缓存
        this.$store.dispatch('recoverState', { moduleName: 'aftersale', stateName: 'listObj' });
      } catch (err) {
        Toast('open', { message: '签收失败', position: 'bottom', duration: 2000 });
        console.error('aftersale/details_express_info.vue@confirmReceive >>>>>', err);
      }
    },
  },
};
</script>
