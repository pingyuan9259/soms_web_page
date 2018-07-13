/* 封装请求
 * 作者：平原
 * 创建：2017-11-22 */

import axios from 'axios';
import qs from 'qs';
import Store from '@/store';
import { MessageBox, Toast } from 'mint-ui';
import { TOKEN, SUPPLIER_ID } from '../config';
import { parseTime } from '../config/filter';

export default {
  _init(params) {
    if (!params.url) {
      throw new Error('无效的请求地址');
    }

    // 格式化时间戳，api接受格式：1990-01-01 00:00:00
    if (params.data && params.data.parseTime) {
      let { data } = params;
      for (let key in data) {
        let item = data[key];
        if (typeof item === 'number' && item.toString().length === 13) {
          data[key] = parseTime(item, '{y}-{M}-{D} {H}:{i}:{s}');
        }
      }
    }

    // Obj转query
    if (params.dataType !== 'form-data') {
      params.data = qs.stringify(params.data, { arrayFormat: 'brackets' });
    }

    // 请求拦截器配置
    axios.interceptors.request.use(config => {
      // 超时时间
      config.timeout = 10000;

      // request header配置
      config.headers.common = {
        'Content-Type': 'application/x-www-form-urlencoded',
        // 'm-app-id': APP_ID,
        'm-supplier-id': SUPPLIER_ID,
        'm-supplier-platform': '10',
        'm-supplier-token': TOKEN,
      };
      return config;
    });

    // 响应拦截器配置
    axios.interceptors.response.use(response => {
      return response;
    }, err => {
      const { response } = err;
      if (response) {
        switch (response.status) {
          case 401:
            err.message = '登录失效，请重新登录';
            MessageBox.alert(err.message);
            Store.dispatch('signout');
            return Promise.reject(err);
        }
      } else {
        if (err.code === 'ECONNABORTED') {
          err.message = '连接超时，请检查网络环境';
          Toast({
            message: err.message,
            position: 'bottom',
            duration: 2000,
          });
        } else {
          err.message = '网络连接失败';
          MessageBox.alert(err.message);
          return Promise.reject(err);
        }
      }
    });

    return params;
  },

  _checkLogin(data) {
    if (data.code === 401000) {
      Store.dispatch('signout');
    }
  },

  _handleError(type, url, data) {
    if (!data || data.code === 500000) {
      console.error(`${ url }'s request fail(${ type }):`, data ? data : '请求失败');
    }
  },

  get(params) {
    params = this._init(params);
    return axios({
      method: 'get',
      url: `${ params.url }?${ params.data }`,
    }).then(res => {
      let data = res.data;
      this._checkLogin(data);
      this._handleError('get', params.url, data);
      return data;
    }).catch(err => {
      return Promise.reject(err);
    });
  },

  post(params) {
    params = this._init(params);
    return axios({
      method: 'post',
      url: params.url,
      data: params.data,
    }).then(res => {
      let data = res.data;
      this._checkLogin(data);
      this._handleError('post', params.url, data);
      return data;
    }).catch(err => {
      return Promise.reject(err);
    });
  },

  put(params) {
    params = this._init(params);
    return axios({
      method: 'put',
      url: params.url,
      data: params.data,
    }).then(res => {
      let data = res.data;
      this._checkLogin(data);
      this._handleError('put', params.url, data);
      return data;
    }).catch(err => {
      return Promise.reject(err);
    });
  },
};
