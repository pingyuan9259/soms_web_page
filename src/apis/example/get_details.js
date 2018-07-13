/* 获取订单售后详情
 * 作者：平原
 * 接口文档：http://wiki.mia.com/pages/viewpage.action?pageId=5379211
 * 2017-12-04 */

import { API_PREFIX } from '@/config';
import Request from '@/config/request';
import Store from '@/store';

export default async returnItemId => {
  try {
    if (typeof returnItemId === 'undefined') {
      throw new Error('api: "aftersale/get_details.js" needs param "returnItemId".');
    }

    let res = await Request.get({
      url: `${ API_PREFIX }/v1/customerService/return/products/${ returnItemId }`,
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
