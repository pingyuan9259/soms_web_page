<!-- 不可退货原因
     作者：平原
     创建：2017-12-05 -->

<style lang="scss" scoped>
  @import './styles/no_return';
</style>

<template>
  <div id="no_return_module">
    <!-- 不可退货原因 -->
    <div class="reason">
      <h3 class="_title">不可退货原因</h3>
      <div class="text_cont">
        <i class="block"></i>
        <div class="textarea">
          <textarea
            v-model="reasonContent"
            @input="watchInput('reason')"
            @propertychange="watchInput('reason')"
            style="height: 56px"
            ref="reason"
            maxlength="1000"
            placeholder="请输入不可退货原因"></textarea>
        </div>
      </div>
    </div>

    <!-- 代金券发放 -->
    <div class="coupon">
      <a
        @click="handelSendMoney"
        class="coupon_suply _title">
        <svg
          :class="{ active: isSendMoney }"
          class="icon _icon_radio" aria-hidden="true"><use
          :xlink:href="`#icon-${ isSendMoney ? 'duihao' : 'weixuanzhong' }`"></use></svg>
        补偿代金券
        <span class="_remark">（商户承担，并在结算款中扣除）</span>
      </a>

      <p
        :class="{ disabled: !isSendMoney }"
        class="coupon_reason _content mb20">
        <span class="_content pull_left">发放原因：</span>
        <a
          v-if="couponReasonName"
          @click="openCouponReasonList"
          class="btn_label">{{ couponReasonName }}</a>
        <a
          @click="openCouponReasonList"
          class="_btn_hollow_xs">
          <span>{{ couponReasonName ? '更改原因' : '选择原因' }}</span>
        </a>
      </p>

      <div
        :class="{ disabled: !isSendMoney }"
        class="coupon_money">
        <p class="sub_title _content pull_left">
          发放金额：
          <label class="_remark">（可多选）</label>
        </p>
        <div class="sub_content">
          <a
            v-for="(item, index) in couponMoney"
            :key="index"
            :btnDisabled="!amount[item]"
            @click="selectCoupon(item)"
            class="_btn_hollow_xs">
            <span>{{ item }}元</span>
          </a>
        </div>
      </div>
    </div>

    <!-- 代金券发放备注 -->
    <div class="remark">
      <h3 class="_title">发放备注</h3>
      <div class="text_cont">
        <i class="block"></i>
        <div class="textarea">
          <textarea
            v-model="remarkContent"
            @input="watchInput('remark')"
            @propertychange="watchInput('remark')"
            style="height: 56px"
            ref="remark"
            maxlength="100"
            placeholder="不要超过100个汉字"></textarea>
        </div>
      </div>
    </div>

    <div class="submit">
      <a
        @click="submit"
        class="btn_s"><span>提交</span></a>
    </div>

    <popup-list
      :show="showCouponReasonList"
      :list="couponReasonList"
      :result.sync="couponReason"></popup-list>
  </div>
</template>

<script>
import _ from 'lodash';
import PopupList from '@/components/common/popup_list';
import { adjustTextareaHeight } from '@/utils/methods';
import Toast from '@/components/common/toast';
import { MessageBox } from 'mint-ui';
import _getCouponReasonList from '@/apis/coupon/get_coupon_reason';
import _putNoReturn from '@/apis/aftersale/put_no_return';

export default {
  props: ['reasonInfo'],

  data() {
    return {
      returnItemId: this.$route.query.returnItemId,
      isLoading: false,
      reasonContent: '', // 不可退货原因
      showCouponReasonList: false, // 是否展开代金券发放原因弹层
      couponReasonList: [],
      couponReasonId: '', // 代金券发放原因id
      couponReasonName: '', // 代金券发放原因
      couponReason: {}, // 用于props.sync回传
      isSendMoney: false, // 是否发放代金券
      amount: {}, // 代金券的金额
      couponMoney: [5, 10, 20, 50], // 代金券的金额列表
      remarkContent: '', // 代金券发放备注
    };
  },

  components: { PopupList },

  watch: {
    couponReason(val) {
      if (val.id) {
        this.couponReasonId = val.id;
        this.couponReasonName = val.name;
      }
      this.showCouponReasonList = false;
    },
  },

  methods: {
    // 点击是否补偿代金券
    handelSendMoney() {
      this.isSendMoney = !this.isSendMoney;
      if (!this.isSendMoney) {
        this.couponReasonName = '';
        this.amount = {};
      }
    },

    // 监听输入框输入
    watchInput(type) {
      adjustTextareaHeight(this.$refs[type], 50, -2);
    },

    // 展开‘发放代金券’原因选择列表
    async openCouponReasonList() {
      // 节流，防止重复多次请求
      // 如果没有点击‘补偿代金券’则return
      if (this.isLoading || !this.isSendMoney) return;
      this.isLoading = true;

      // 如果网络缓慢，则显示加载中Toast
      Toast('open', {
        message: '加载中...',
        position: 'bottom',
        delay: 500,
      });

      // 获取代金券发放原因列表
      try {
        let couponReasonList = await _getCouponReasonList();
        this.couponReasonList = Object.assign([], couponReasonList);

        // 接口返回时关闭Toast
        Toast('close');
        this.isLoading = false;
        this.showCouponReasonList = true;
      } catch (err) {
        console.error('aftersale/no_return.vue@openCouponReasonList >>>>>', err);
      }
    },

    // 选择代金券金额（多选）
    selectCoupon(item) {
      if (!this.isSendMoney) return;

      let _amount = _.cloneDeep(this.amount);
      if (_amount[item]) {
        delete _amount[item];
      } else {
        _amount[item] = item;
      }

      if (Object.getOwnPropertyNames(_amount).length > 3) {
        MessageBox.alert('代金券最多先择3张');
        return;
      }

      this.amount = Object.assign({}, _amount);
    },

    // 提交
    async submit() {
      try {
        let amountStr = '';
        if (!this.reasonContent) {
          MessageBox.alert('请输入不可退货原因');
          return;
        } else if (this.isSendMoney) {
          amountStr = this.parseAmount(this.amount);
          if (!this.couponReasonId) {
            MessageBox.alert('请选择发放原因');
            return;
          } else if (!amountStr) {
            MessageBox.alert('请选择代金券金额');
            return;
          } else if (!this.remarkContent) {
            MessageBox.alert('请输入发放备注');
            return;
          }
        }

        await _putNoReturn({
          reason: this.reasonContent,
          reasonId: this.couponReasonId,
          isSendMoney: this.isSendMoney,
          amount: this.parseAmount(),
          description: this.remarkContent,
          returnItemId: this.returnItemId,
        });
        Toast('open', { message: '提交成功', position: 'bottom', duration: 2000 });
        this.$store.dispatch('getAftersaleInfo', this.returnItemId);
        this.$store.dispatch('getAftersaleDetails', this.returnItemId);
        // 列表数据存在更新，清理state的list缓存
        this.$store.dispatch('recoverState', { moduleName: 'aftersale', stateName: 'listObj' });
        this.$router.replace({
          path: '/aftersale/list',
          query: { pageType: 'preExamineNum' },
        });
      } catch (err) {
        Toast('open', { message: '提交失败', position: 'bottom', duration: 2000 });
        console.error('aftersale/no_return.vue@submit >>>>>', err);
      }
    },

    // 将金额整形为后端想要的格式
    parseAmount(amount) {
      let amountStr = '';
      for (let key in this.amount) {
        amountStr += key + ',';
      }
      return amountStr ? amountStr.substring(0, amountStr.length - 1) : '';
    },
  },
};
</script>
