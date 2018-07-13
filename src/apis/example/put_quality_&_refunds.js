/* 质检及退款
 * 作者：平原
 * 接口文档：http://wiki.mia.com/pages/viewpage.action?pageId=5379278
 * 2017-12-04 */

import { API_PREFIX } from '@/config';
import Request from '@/config/request';
import Store from '@/store';
import { checkParams } from '@/utils/methods';

export default async params => {
  // params: { resultId, qualityTestResult, isReturnAllMoney, deduction, qualityTestInfo, returnItemId }
  try {
    const noParamName = checkParams(params, [
      'resultId',
      'qualityTestResult',
      'isReturnAllMoney',
      'qualityTestInfo',
      'returnItemId',
    ]);
    if (noParamName) {
      throw new Error(`api: "aftersale/put_quality_&_refund.js" needs param "${ noParamName }".`);
    }

    let res = await Request.put({
      url: `${ API_PREFIX }/v1/customerService/qualityTestAndRefund/${ params.returnItemId }`,
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
