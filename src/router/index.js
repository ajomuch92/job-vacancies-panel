import Vue from 'vue';
import Router from 'vue-router';

import Index from '../pages/Index';
// import store from '../store';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      component: Index
    },
    // {
    //   path: '/panel',
    //   component: Dashboard,
    //   children: [
    //     {
    //       path: '/',
    //       component: DashboardMain
    //     },
    //     {
    //       path: '/orders',
    //       component: DashboardOrders
    //     }
    //   ],
    //   meta: {
    //     requiresAuth: true,
    //   }
    // }
  ]
});

export default router;