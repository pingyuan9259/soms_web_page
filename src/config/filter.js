/* 过滤器
 * 作者：平原
 * 2017-11-28 */

import _ from 'lodash';

// 格式化时间戳
const parseTime = (time, cFormat) => {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (typeof time === 'object') {
    date = time;
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000;
    date = new Date(time);
  }
  // 大写代表00，小写代表0
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    M: date.getMonth() + 1,
    d: date.getDate(),
    D: date.getDate(),
    h: date.getHours(),
    H: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const timeStr = format.replace(/{(y|m|M|d|D|h|H|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1];
    if (result.length > 0 && value < 10) {
      switch (key) {
        case 'M':
        case 'D':
        case 'H':
        case 'i':
        case 's':
          value = '0' + value;
          break;
      }
    }
    return value || 0;
  });
  return timeStr;
};

// 归档时间戳
const formatTime = (time, option) => {
  time = +time * 1000;
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return '刚刚';
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前';
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前';
  } else if (diff < 3600 * 24 * 2) {
    return '1天前';
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分';
  }
};

// 过滤请求参数对象中的空属性
const apiQueryFilter = obj => {
  let _obj = _.cloneDeep(obj);
  for (let key in _obj) {
    if (_obj[key] && typeof _obj[key] === 'object') {
      apiQueryFilter(_obj[key]);
    } else if (_obj[key] === undefined || _obj[key] === null || _obj[key] === '') {
      delete _obj[key];
    }
  }

  return _obj;
};

// 统一图片路径
const parseImg = url => {
  if (url) {
    return '//img.miyabaobei.com/' + url;
  } else {
    return '';
  }
};

export {
  parseTime,
  formatTime,
  apiQueryFilter,
  parseImg,
};
