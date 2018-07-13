<style lang="scss" scoped>
  @import './styles/details';
</style>

<template>
  <div id="details_module">
    <p class="page_remark">注：{{ pageRemark[pageType] }}</p>

    <div class="details_info">
      <div class="item_header">
        <span class="title pull_left">订单号：{{ info.orderCode || '-' }}</span>
        <span class="id pull_right">退货单号：{{ info.returnsId || '-' }}</span>
      </div>
      <div class="item_content">
        <p>申请退货时间：{{ info._created || '-' }}</p>
        <p>退货原因：{{ info.reasonInfo || '-' }}</p>
        <p>退货数量：{{ info.returnGoodsNum || '-' }}</p>
      </div>
      <div class="item_footer">
        <span class="title pull_left">收货人：{{ info.receiverName || '-' }}</span>
        <span class="id pull_right">收货人手机：{{ info.receiverPhone || '-' }}</span>
      </div>
    </div>

    <i class="line"></i>

    <details-product :details="details">
      <details-express-info
        v-if="details.status !== 6"
        :details="details"></details-express-info>

      <i class="line"></i>

      <details-quality
        v-if="details.status === 1 || details.status === 3"
        :details="details"></details-quality>
    </details-product>

    <div v-if="details.status === 6" class="option">
      <a
        @click="handleCanReturn"
        class="can_cancel btn_s"><span>可退货</span></a>
      <a
        @click="$router.push({
          path: '/aftersale/noreturn',
          query: {
            returnsId: info.returnsId,
            returnItemId: details.returnItemId,
          },
        })"
        class="cannot_cancel btn_s"><span>不可退货</span></a>
    </div>
    <div v-else class="blank"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import DetailsProduct from './modules/details_product';
import DetailsExpressInfo from './modules/details_express_info';
import DetailsQuality from './modules/details_quality';
import Toast from '@/components/common/toast';
import { aftersaleStatus } from '@/config/constants';
import _putReturn from '@/apis/aftersale/put_return';

export default {
  data() {
    return {
      returnItemId: this.$route.query.returnItemId,
    };
  },

  components: {
    DetailsProduct,
    DetailsExpressInfo,
    DetailsQuality,
  },

  props: {
    pageRemark: {
      required: true,
      type: Object,
    },
  },

  computed: mapState({
    info: state => state.aftersale.info,
    details: state => state.aftersale.details,
    pageType: state => state.common.pageType,
  }),

  watch: {
    details(val) {
      // #0024
      // 更新pageType，用来显示相应的顶部注释pageRemark[pageType]
      // 针对搜索使用，正常可以通过list的tabs来设定相应的pageType
      this.$store.dispatch('updatePageType', aftersaleStatus[val.status]);
    },
  },

  created() {
    this.$store.dispatch('getAftersaleInfo', this.returnItemId);
    this.$store.dispatch('getAftersaleDetails', this.returnItemId);
  },

  methods: {
    // 点击可退货
    async handleCanReturn() {
      try {
        await _putReturn(this.returnItemId);
        Toast('open', { message: '设置成功', position: 'bottom', duration: 2000 });
        this.$store.dispatch('getAftersaleInfo', this.returnItemId);
        this.$store.dispatch('getAftersaleDetails', this.returnItemId);
        // 列表数据存在更新，清理state的list缓存
        this.$store.dispatch('recoverState', { moduleName: 'aftersale', stateName: 'listObj' });
      } catch (err) {
        Toast('open', { message: '设置失败', position: 'bottom', duration: 2000 });
        console.error('aftersale/details.vue@handleCanReturn >>>>>', err);
      }
    },
  },
};
</script>
