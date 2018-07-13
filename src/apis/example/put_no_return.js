/* 提交订单售后不可退货
 * 作者：平原
 * 接口文档：http://wiki.mia.com/pages/viewpage.action?pageId=5379260
 * 2017-12-04 */

import { API_PREFIX } from '@/config';
import Request from '@/config/request';
import Store from '@/store';
import { checkParams } from '@/utils/methods';

export default async params => {
  // params: { reason, reasonId, isSendMoney, amount, description, returnItemId, isSendMoney }
  try {
    const noParamName = checkParams(params, [
      'reason',
      'reasonId',
      'isSendMoney',
      'description',
      'returnItemId',
      'isSendMoney',
    ]);
    if (noParamName) {
      throw new Error(`api: "aftersale/put_no_return.js" needs param "${ noParamName }".`);
    }

    let res = await Request.put({
      url: `${ API_PREFIX }/v1/customerService/unReturnProduct/${ params.returnItemId }`,
      data: params,
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
