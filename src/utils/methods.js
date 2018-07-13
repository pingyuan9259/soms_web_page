/* 函数工具库
 * 作者：平原
 * 创建：2017-6-15 */

// 数组转为map
const arrToObjByKey = (key, arr) => {
  if (!key) {
    throw new Error('arrToObjByKey in enhance.js is lack of key');
  }
  if (typeof key !== 'string') {
    throw new Error('arrToObjByKey in enhance.js, key should be string');
  }
  let result = {};
  for (let item of arr) {
    if (item && item[key]) {
      result[item[key]] = item;
    }
  }
  return result;
};

// 阻止滚动冒泡
const stopScrollBubble = el => {
  let scrollHeight = el.scrollHeight;
  let clientHeight = el.clientHeight;
  el.addEventListener('mousewheel', e => {
    let scrollTop = el.scrollTop;
    let scrollOffset = scrollHeight - clientHeight - scrollTop;
    // console.log(scrollOffset)
    if ((e.wheelDelta < 0 && scrollOffset === 0) || (e.wheelDelta > 0 && scrollTop === 0)) {
      e.preventDefault();
    } else {
      e.returnValue = true;
    }
  });
};

// 获取url参数
const getQueryString = name => {
  // eslint-disable-next-line
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  let r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
};

// 获取url参数对象
const getQueryObject = url => {
  url = url === null ? window.location.href : url;
  const search = url.substring(url.lastIndexOf('?') + 1);
  const obj = {};
  const reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1);
    let val = decodeURIComponent($2);
    val = String(val);
    obj[name] = val;
    return rs;
  });
  return obj;
};

// 自动调整输入框高度
const adjustTextareaHeight = (el, height, offset) => {
  if (!el) return;
  // 防止篇幅过长时改变height导致滚动条瞎跳
  // 预先记录一下页面的滚动值
  let pageYOffset = window.pageYOffset;
  el.style.height = height + 'px';
  el.style.height = (el.scrollHeight - offset) + 'px';
  // 恢复页面的滚动值
  window.scroll(0, pageYOffset);
};

// 检查调用api时缺失的参数
const checkParams = (params, keywords) => {
  for (let i = 0, len = keywords.length; i < len; i++) {
    let _i = keywords[i];
    if (typeof params[_i] === 'undefined') {
      return _i;
    }
  }
  return '';
};

export {
  arrToObjByKey,
  stopScrollBubble,
  getQueryString,
  getQueryObject,
  adjustTextareaHeight,
  checkParams,
};
