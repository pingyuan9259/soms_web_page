<!-- 搜索时间选择
     作者：平原
     创建：2017-12-05 -->

<style lang="scss" scoped>
  @import '../styles/search';
</style>

<template>
  <div id="search_tickets_date_module">
    <div class="created_time">
      <label>申请售后时间</label>
      <div class="input">
        <input
          @click="datePickerOpen('startTime', 'startDate')"
          v-model="dateModel.startTime"
          readonly class="start">
        <i></i>
        <input
          @click="datePickerOpen('endTime', 'endDate')"
          v-model="dateModel.endTime"
          readonly class="end">
      </div>
    </div>
    <a
      :btnDisabled="clearDisabled"
      @click="datePickerClear"
      class="clear btn_label">清空时间选择</a>

    <datetime-picker
      ref="datePicker"
      year-format="{value}年"
      month-format="{value}月"
      date-format="{value}日"
      type="date"
      v-model="initDate"
      :start-date="new Date(startDate)"
      :end-date="new Date(endDate)"
      @cancel="datePickerCancel"
      @confirm="datePickerConfirm">
    </datetime-picker>
  </div>
</template>

<script>
import { DatetimePicker } from 'mint-ui';
import { parseTime } from '@/config/filter';

export default {
  data() {
    return {
      timer: null, // 定时器
      clearDisabled: true, // 清空按钮置灰
      selectPickerName: '', // 当前datePicker的时间名称，示例：beginCreateTime
      selectPickerRange: '', // 当前datePicker的区间名称，示例：startDate

      // 时间模板
      dateModel: {
        startTime: '', // input中显示时间，示例：1990-07-20
        startDate: 0, // 时间戳，用于绑定datePicker的最大最小可选值
        endTime: '',
        endDate: 0,
      },

      initDate: '', // datePicker初始时间
      startDate: 1356969600000, // datePicker的最小可选值
      endDate: new Date().getTime() + 86400000, // datePicker的最大可选值
    };
  },

  components: { DatetimePicker },

  methods: {
    // 初始化datePicker
    init({ startDate, endDate, range }) {
      this.initDate = new Date(); // 初始时间为今天
      if (range === 'startDate') {
        // 如果打开开始时间
        this.endDate = endDate || new Date().getTime(); // 最大值是已有的endDate或者初始值
        this.startDate = 1356969600000; // 最小值是2013年1月1日
      } else if (range === 'endDate') {
        // 如果打开结束时间
        this.startDate = startDate || 1356969600000; // 最小值是已有的start或者初始值
        this.endDate = new Date().getTime() + 86400000; // 最大值是明天
      } else {
        // 如果没有range，则恢复初始
        this.startDate = 1356969600000;
        this.endDate = new Date().getTime() + 86400000;
      }
    },

    // 打开datePicker
    datePickerOpen(name, range) {
      this.selectPickerName = name;
      this.selectPickerRange = range;

      // 初始化时间
      // 更新datePicker的最大/最小可选值
      // 比如你选择了结束时间，那么开始时间的最大可选值就是刚才选的结束时间
      this.init({
        startDate: this.dateModel.startDate,
        endDate: this.dateModel.endDate,
        range: range,
      });

      this.$refs.datePicker.open();
    },

    // 确认时间选择
    datePickerConfirm(val) {
      const _val = val.getTime();
      const name = this.selectPickerName;
      const range = this.selectPickerRange;
      this.clearDisabled = false; // 选择时间后，清空按钮高亮

      // 更新选中的时间
      // 示例：this.createTime.beginCreateTime = '1990-07-20'
      // 示例：this.createTime.startDate = 1356969600000
      // 如果选中的时结束时间，那么开始时间的最大值就应该时结束时间减去一天
      this.dateModel[name] = parseTime(_val, '{y}-{m}-{d}');
      this.dateModel[range] = range === 'startDate' ? _val + 86400000 : _val - 86400000;

      // #0004
      this.$emit('update:datePickerValue', { [name]: _val });
    },

    // 清空时间选择
    datePickerClear() {
      this.init({ startDate: 0, endDate: 0 });
      this.dateModel = {
        startTime: '',
        startDate: 0,
        endTime: '',
        endDate: 0,
      };
      this.clearDisabled = true;

      // #0004
      this.$emit('update:datePickerValue', { startTime: '', endTime: '' });
    },
  },
};
</script>
