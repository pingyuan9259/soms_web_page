/* cookie操作
 * 作者：平原
 * 创建：2017-11-22 */

let doc = document;

export default {
  // 写入cookies
  setCookie(name, value, domain, expiredays) {
    let exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    let expires = expiredays == null ? '' : `;expires=${ exdate.toGMTString() }`;
    doc.cookie = `${ name }=${ escape(value) }${ expires };path=/;domain=.${ domain }`;
    return true;
  },

  // 读取cookies
  getCookie(name) {
    let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
    let arr = doc.cookie.match(reg);
    if (arr) {
      return arr[2];
    } else {
      return null;
    }
  },

  // 删除cookies
  delCookie(name, domain) {
    let exp = new Date();
    // this.getCookie(name)
    let cval = ' ';
    exp.setTime(exp.getTime() - 100);
    doc.cookie = `${ name }=${ cval };expires=${ exp.toGMTString() };path=/;domain=.${ domain }`;
  },
};
