<!-- 售后单详情质检及退货
     作者：平原
     创建：2017-12-06 -->

<style lang="scss" scoped>
  @import '../styles/details_quality';
</style>

<template>
  <div id="detals_quality_module">
    <h3 class="_title">退货质检</h3>
    <div class="result">
      <span class="_content pull_left">质检结果：</span>
      <div class="_content result_type">
        <a
          v-for="(item, index) in qualityResult"
          :key="index"
          :btnDisabled="resultId !== item.id"
          @click="selectResult(item.id, item.name)"
          class="_btn_hollow_xs">
          <span>{{ item.name }}</span>
        </a>
      </div>
    </div>

    <div class="score">
      <span class="_content pull_left">扣除金额：</span>
      <div class="_content score_type">
        <a
          @click="returnAllMoney = true"
          class="_content">
          <svg
            :class="{ active: returnAllMoney }"
            class="icon _icon_radio" aria-hidden="true"><use
            :xlink:href="`#icon-${ returnAllMoney ? 'duihao' : 'weixuanzhong' }`"></use></svg>
          全部金额
        </a>
        <a
          @click="returnAllMoney = false"
          class="_content">
          <svg
            :class="{ active: !returnAllMoney }"
            class="icon _icon_radio" aria-hidden="true"><use
            :xlink:href="`#icon-${ !returnAllMoney ? 'duihao' : 'weixuanzhong' }`"></use></svg>
          部分金额
          <p :class="{ disabled: returnAllMoney }" class="_content">
            扣除
            <input
              :disabled="returnAllMoney"
              v-model="deduction"
              type="number">
            元
          </p>
        </a>
      </div>
    </div>

    <div class="info">
      <span class="_content pull_left">质检说明：</span>
      <div class="_content info_textarea">
        <textarea
          placeholder="请填写质检说明"
          v-model="infoContent"></textarea>

        <a
          @click="handleSubmit"
          class="_btn_hollow_xs submit"><span>质检及退款</span></a>
      </div>
    </div>
  </div>
</template>

<script>
import { MessageBox } from 'mint-ui';
import Toast from '@/components/common/toast';
import _qualityAndReturn from '@/apis/aftersale/put_quality_&_refunds';

export default {
  props: ['details'],

  data() {
    return {
      returnItemId: this.$route.query.returnItemId,
      qualityResult: [
        { name: '全新完好', id: 1 },
        { name: '质量问题', id: 2 },
        { name: '用户损坏', id: 3 },
        { name: '快递损坏', id: 4 },
        { name: '仓库问题', id: 5 },
      ],
      resultId: 0,
      result: '',
      returnAllMoney: true,
      infoContent: '',
      deduction: '', // 扣除金额
    };
  },

  methods: {
    selectResult(id, name) {
      this.resultId = id;
      this.result = name;
    },

    async handleSubmit() {
      if (!this.resultId) {
        MessageBox.alert('请选择质检结果');
        return;
      } else if (!this.returnAllMoney && !this.deduction) {
        MessageBox.alert('请输入扣除金额');
        return;
      } else if (!this.infoContent) {
        MessageBox.alert('请输入质检说明');
        return;
      }

      try {
        await _qualityAndReturn({
          resultId: this.resultId,
          qualityTestResult: this.result,
          isReturnAllMoney: this.returnAllMoney,
          deduction: this.deduction || 0,
          qualityTestInfo: this.infoContent,
          returnItemId: this.returnItemId,
        });
        Toast('open', { message: '提交成功', position: 'bottom', duration: 2000 });
        this.$store.dispatch('getAftersaleDetails', this.returnItemId);
        // 列表数据存在更新，清理state的list缓存
        this.$store.dispatch('recoverState', { moduleName: 'aftersale', stateName: 'listObj' });
      } catch (err) {
        Toast('open', { message: '提交失败', position: 'bottom', duration: 2000 });
        console.error('aftersale/details.vue@handleSubmit >>>>>', err);
      }
    },
  },
};
</script>
