/* 提交订单售后确认签收
 * 作者：平原
 * 接口文档：http://wiki.mia.com/pages/viewpage.action?pageId=5379271
 * 2017-12-04 */

import { API_PREFIX } from '@/config';
import Request from '@/config/request';
import Store from '@/store';

export default async returnItemId => {
  try {
    if (typeof returnItemId === 'undefined') {
      throw new Error('api: "aftersale/put_confirm_receive.js" needs param "returnItemId".');
    }

    let res = await Request.put({
      url: `${ API_PREFIX }/v1/customerService/confirmReceipt/${ returnItemId }`,
    });

    if (res.resCode && res.resCode === 200000) {
      return Promise.resolve(res.resData);
    } else {
      Store.dispatch('requestFail', res);
      return Promise.reject({ message: '接口返回信息异常' });
    }
  } catch (err) {
    return Promise.reject(err);
  }
};
