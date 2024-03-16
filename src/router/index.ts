import * as VueRouter from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import('../views/Main.vue'),
    name: 'home',
  },
  {
    path: '/editor',
    component: () => import('../views/Editor.vue'),
    name: 'home',
  },
];

export const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
});
