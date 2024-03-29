import * as VueRouter from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import('../views/Main.vue'),
    name: 'main',
  },
  {
    path: '/editor',
    component: () => import('../views/Editor.vue'),
    name: 'editor',
  },
];

export const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
});
