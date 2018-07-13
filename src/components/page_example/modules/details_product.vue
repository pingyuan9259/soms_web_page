<!-- 售后单详情产品信息
     作者：平原
     创建：2017-12-06 -->

<style lang="scss" scoped>
  @import '../styles/details_product';
</style>

<template>
  <div id="details_product_module">
    <div class="product">
      <h3 class="_title">取消商品</h3>
      <div class="item">
        <div class="cover">
          <img :src="details._productPic">
        </div>
        <div class="desc">
          <h4>{{ details.productName || '-' }}</h4>
          <p class="_remark">SKU：{{ details.productSku || '-' }}</p>
          <p class="_remark">尺码：{{ details.productSize || '-' }}</p>
          <p class="_remark">实价支付：{{ details.dealPrice || '-' }}</p>
          <p class="_remark">七天无理由退货：{{ details.is7DaysReturn ? '支持' : '不支持' }}</p>
        </div>
      </div>
    </div>
    <i class="line"></i>

    <slot></slot>
    <i class="line"></i>

    <div class="reason">
      <h3 class="_title">退货原因：{{ details.notes || '-' }}</h3>
      <p class="_remark">注：该单售后原因需要承担运费</p>
    </div>
    <i class="line"></i>

    <div class="remark">
      <h3 class="_title">退货备注：{{ details.returnNote || '-' }}</h3>
          
      <div v-if="details._albumList && details._albumList.length" class="images">
        <Album
          :album-list="details._albumList"
          album-width="690"></Album>
      </div>
    </div>
    <i class="line"></i>

    <div class="invoiceInfo">
      <h3 class="_title">发票：{{ details.invoiceInfo || '-' }}</h3>
    </div>
    <i class="line"></i>
  </div>
</template>

<script>
import Album from '@/components/common/album';

export default {
  props: {
    details: {
      required: true,
      type: Object,
    },
  },

  components: {
    Album,
  },
};
</script>
