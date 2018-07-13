/* EfficiencyOptimization路由 */

const EfficiencyOptimization = () => import(/* webpackChunkName: "efficiency_optimization" */ '@/components/EfficiencyOptimization');
const Overview = () => import(/* webpackChunkName: "efficiency_optimization" */ '@/components/EfficiencyOptimization/Overview');
const SpeedOptimization = () => import(/* webpackChunkName: "efficiency_optimization" */ '@/components/EfficiencyOptimization/SpeedOptimization');

export default {
  path: 'efficiency_optimization',
  component: EfficiencyOptimization,
  children: [
    {
      path: 'overview',
      component: Overview,
      meta: {
        title: 'SOMS-状态评估优化-概览',
        transLevel: 1, // 路由过渡动效等级
        // token: true,
      },
    },
    {
      path: 'speed_optimization',
      component: SpeedOptimization,
      meta: {
        title: 'SOMS-状态评估优化-转速优化工具',
        transLevel: 1, // 路由过渡动效等级
        // token: true,
      },
    },
  ],
};
