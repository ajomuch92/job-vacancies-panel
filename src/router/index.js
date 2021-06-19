import Vue from 'vue';
import Router from 'vue-router';

import Index from '../pages/Index';
import Panel from '../pages/panel/Index';
import Candidates from '../pages/panel/Candidates';
import Vacancies from '../pages/panel/Vacancies';
// import store from '../store';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      component: Index
    },
    {
      path: '/panel',
      component: Panel,
      children: [
        {
          path: '/',
          component: Candidates
        },
        {
          path: '/vacancies',
          component: Vacancies
        }
      ],
      meta: {
        requiresAuth: true,
      }
    }
  ]
});

export default router;