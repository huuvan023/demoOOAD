
const routes = [
  {
    path: '/',
    component: () => import('../pages/Login.vue'),
  },
  {
    path: '/main',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/', component: () => import('pages/Index.vue') },
      { path: '/bookrequire', component: () => import('pages/SachYeuCau.vue') },
      { path: '/bookborrow', component: () => import('pages/SachDangMuon.vue') },
      { path: '/qluser', component: () => import('pages/QuanLyUser.vue') },
      { path: '/qlsach', component: () => import('pages/QuanLySach.vue') },
      { path: '/xlvipham', component: () => import('pages/XuLiViPham.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
