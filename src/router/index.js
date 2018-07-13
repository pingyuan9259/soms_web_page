/* 路由配置 */

import Vue from 'vue';
import Router from 'vue-router';
import EventBus from '@/utils/event_bus';
import { TOKEN, SUPPLIER_ID, SUPPLIER_PRIORITY, IS_SERVING_KEY } from '@/config';
import Cookie from '@/utils/cookie';
import Store from '@/store';

// modules
import Container from '@/components';
// import SignIn from '@/components/SignIn';
import EfficiencyOptimization from './modules/EfficiencyOptimization';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    // SignIn,

    {
      path: '/',
      component: Container,
      redirect: '/efficiency_optimization',
      children: [
        EfficiencyOptimization,
      ],
    },
  ],

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop || document.documentElement.scrollTop;
      }
      return { x: 0, y: to.meta.savedPosition || 0 };
    }
  },
});

router.beforeEach((to, from, next) => {
  // 显示加载进度条
  EventBus.$emit('loadingProcess');

  // 更新页面title
  document.title = to.meta.title;

  // 判断登录态
  if (to.meta.token && !TOKEN) {
    next({
      path: '/user/signin',
      query: { redirect: to.fullPath },
    });
    return;
  }

  // 判断供应商权限
  if (SUPPLIER_PRIORITY < to.meta.priority) {
    next('/home');
    return;
  }

  // 审核未通过的用户不允许进入平台
  // supplierId为0的时候代表审核没有通过
  if (to.meta.verify && !Number(SUPPLIER_ID)) {
    next('/user/edit');
    return;
  }

  // 判断该页面是否需要检查品牌是否作废
  if (to.meta.checkBrand) {
    if (to.query.pageType && to.query.pageType === 'modify') {
      Store.dispatch('checkBrandIsVisible', to.query.brandId).then(brandIsVisible => {
        if (brandIsVisible) next();
      });
      return;
    }
  }

  // 判断是否跳转到维护页面
  if (Cookie.getCookie(IS_SERVING_KEY) === '1' && to.path !== '/serving') {
    next('/serving');
    return;
  }

  next();
});

export default router;
