/* 全局配置 */

import cookie from 'js-cookie';
import _ from 'lodash';

// 全局常量
const loc = window.location;
const host = loc.host;
let port = loc.port;
const APP_ENV = host.split('.')[0].split('-')[1] ? host.split('.')[0].split('-')[1] : 'pro';

// 初始变量
let APP_ID = '';
let APP_HOST = '';
let DEVICE_ID_KEY = '';
let APP_IS_LOCAL = false;
let API_PREFIX = '//api.b2b-partner.miyabaobei.com:8082';
let IMG_PREFIX = '//img.miyabaobei.com/';
let APP_TOKEN_KEY = '_app_token';
let TOKEN = '';
let SUPPLIER_ID_KEY = '_supplier_id';
let SUPPLIER_ID = '';
let SUPPLIER_TYPE_KEY = '_supplier_type';
let SUPPLIER_TYPE = 1; // 区分保税商家和一般贸易 1一般贸易, 2保税
let SUPPLIER_MOBILE_KEY = '_supplier_mobile';
let SUPPLIER_MOBILE = '';
let PLATFORM_ID_KEY = '_platform_id';
let IS_SERVING_KEY = '_is_serving';
let SUPPLIER_PRIORITY_KEY = '_supplier_priority';
let SUPPLIER_PRIORITY = 0;

let consoleData = {}; // 打印相关变量

// 获得host
APP_HOST = host;

// 获得顶级域
let topHostMatch = loc.hostname.match(/\.([^.]+\.com)$/);
let TOP_LEVEL_HOST = topHostMatch && topHostMatch[1];

// 获取设备信息
APP_ID = '56c6c309243cb728205a3dff';
DEVICE_ID_KEY = '_device_id_' + APP_ID;

// 如果有端口则判断为本地开发
if (port) {
  APP_IS_LOCAL = true;
}

// 确定相关的环境变量
if (APP_ENV === 'pro') {
  API_PREFIX = '//api-seller.xiaohuan365.com:8082';
} else {
  switch (APP_ENV) {
    case 'dev':
      port = 8082;
      break;
    case 'apidebug':
      port = 9081;
      break;
    case 'zhangchunming':
      port = 80;
      break;
    case 'yangzhenjie':
      port = 80;
      break;
    case 'songke':
      port = 9081;
      break;
    case 'liutao':
      port = 8080;
      break;
    case 'shikuan':
      port = 8080;
      break;
    case 'zichao':
      port = 8082;
      break;
  }
  APP_TOKEN_KEY = `_app_token_${ APP_ENV }`;
  API_PREFIX = `//api-${ APP_ENV }.b2b-partner.miyabaobei.com${ ':' + port }`;
  SUPPLIER_ID_KEY = `_supplier_id_${ APP_ENV }`;
  SUPPLIER_TYPE_KEY = `_supplier_type_${ APP_ENV }`;
  SUPPLIER_MOBILE_KEY = `_supplier_mobile_${ APP_ENV }`;
  PLATFORM_ID_KEY = `_platform_id_${ APP_ENV }`;
  IS_SERVING_KEY = `_is_serving_${ APP_ENV }`;
  SUPPLIER_PRIORITY_KEY = `_supplier_priority_${ APP_ENV }`;
}

// 当token出现变化时要在此同步token
const syncUserInfo = () => {
  TOKEN = cookie.get(APP_TOKEN_KEY);
  SUPPLIER_ID = cookie.get(SUPPLIER_ID_KEY);
  SUPPLIER_TYPE = Number(cookie.get(SUPPLIER_TYPE_KEY)) || 0;
  SUPPLIER_MOBILE = cookie.get(SUPPLIER_MOBILE_KEY);
  SUPPLIER_PRIORITY = Number(cookie.get(SUPPLIER_PRIORITY_KEY)) || 0;

  // 接下来是一些本地辅助相关
  if (!APP_IS_LOCAL) return;

  // 打印相关变量
  let _consoleData = _.clone(consoleData);

  consoleData = {
    APP_ENV: APP_ENV,
    APP_ID: APP_ID,
    APP_TOKEN_KEY: APP_TOKEN_KEY,
    TOKEN: TOKEN,
    SUPPLIER_ID_KEY: SUPPLIER_ID_KEY,
    SUPPLIER_ID: SUPPLIER_ID,
    SUPPLIER_TYPE: SUPPLIER_TYPE,
    SUPPLIER_MOBILE: SUPPLIER_MOBILE,
    API_PREFIX: API_PREFIX,
    IMG_PREFIX: IMG_PREFIX,
    SUPPLIER_PRIORITY: SUPPLIER_PRIORITY,
  };

  if (!_.isEqual(_consoleData, consoleData)) {
    console.log(consoleData, '<===============环境变量');
  }
};

// 获取登陆验证TOKEN以及用户ID(登陆后有效)
syncUserInfo();

export {
  APP_HOST,
  APP_IS_LOCAL,
  TOP_LEVEL_HOST,
  APP_ENV,
  API_PREFIX,
  IMG_PREFIX,
  APP_ID,
  DEVICE_ID_KEY,
  APP_TOKEN_KEY,
  TOKEN,
  SUPPLIER_ID_KEY,
  SUPPLIER_ID,
  SUPPLIER_TYPE_KEY,
  SUPPLIER_TYPE,
  SUPPLIER_MOBILE_KEY,
  SUPPLIER_MOBILE,
  syncUserInfo,
  PLATFORM_ID_KEY,
  IS_SERVING_KEY,
  SUPPLIER_PRIORITY_KEY,
  SUPPLIER_PRIORITY,
};
