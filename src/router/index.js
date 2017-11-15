import Vue from 'vue';
import Router from 'vue-router';
import Layouts from '../views/layouts';
import todo from '../views/todo';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: Layouts.name,
      component: Layouts,
      children: [
        {
          path: 'todo/:id',
          name: 'todo',
          component: todo,
        },
      ],
    },
  ],
});
