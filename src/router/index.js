import Vue from 'vue'
import VueRouter from 'vue-router'
/* Layouts */
const Layout2 = () => import('../layouts/Layout2.vue')
const AuthLayout = () => import('../layouts/AuthLayouts/AuthLayout')
/* Dashboards View */
const Dashboard1 = () => import('../views/Dashboards/Dashboard1.vue')
/* Authentic View */
const SignIn1 = () => import('../views/AuthPages/Default/SignIn1')
const SignUp1 = () => import('../views/AuthPages/Default/SignUp1')
const RecoverPassword1 = () => import('../views/AuthPages/Default/RecoverPassword1')
const LockScreen1 = () => import('../views/AuthPages/Default/LockScreen1')
const ConfirmMail1 = () => import('../views/AuthPages/Default/ConfirmMail1')
const Callback = () => import('../views/AuthPages/Default/Callback')

/* Apps View */
const SocialApp = () => import('../views/Social/SocialApp')

Vue.use(VueRouter)

const authChildRoutes = (prop) => [
  {
    path: 'sign-in1',
    name: prop + '.sign-in1',
    meta: { auth: true },
    component: SignIn1
  },
  {
    path: 'sign-up1',
    name: prop + '.sign-up1',
    meta: { auth: true },
    component: SignUp1
  },
  {
    path: 'password-reset1',
    name: prop + '.password-reset1',
    meta: { auth: true },
    component: RecoverPassword1
  },
  {
    path: 'lock-screen1',
    name: prop + '.lock-screen1',
    meta: { auth: true },
    component: LockScreen1
  },
  {
    path: 'confirm-mail1',
    name: prop + '.confirm-mail1',
    meta: { auth: true },
    component: ConfirmMail1
  }
]
const socialChildRoute = (prop) => [
  {
    path: 'social',
    name: prop + '.list',
    meta: { auth: false, name: 'Social App' },
    component: SocialApp
  }
]

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: Layout2,
    meta: { auth: true },
    children: [
      {
        path: '',
        name: 'dashboard.home-1',
        meta: { auth: false, name: 'Home 1' },
        component: Dashboard1
      }
    ]
  },
  {
    path: '',
    name: 'dashboard',
    component: Layout2,
    meta: { auth: false },
    children: [
      {
        path: 'home-2',
        name: 'dashboard.home-2',
        meta: { auth: false, name: 'Home 2' },
        component: Dashboard1
      }
    ]
  },
  {
    path: '/auth',
    name: 'auth1',
    component: AuthLayout,
    meta: { auth: true },
    children: authChildRoutes('auth1')
  },
  {
    path: '/social/:username',
    name: 'social',
    component: Layout2,
    meta: { auth: true },
    children: socialChildRoute('social')
  },
  {
    path: '/callback',
    name: 'callback',
    meta: { auth: false },
    component: Callback
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.VUE_APP_BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/auth/sign-in1', '/auth/sign-up1', '/dark/auth/sign-in1', '/dark/auth/sign-up1']
  if (publicPages.includes(to.path)) {
    localStorage.removeItem('user')
    localStorage.removeItem('access_token')
  }
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = localStorage.getItem('user')
  if (to.meta.auth) {
    if (authRequired && loggedIn === null) {
      return next('/auth/sign-in1')
    } else if (to.name === 'dashboard' || to.name === 'dashboard.home-1') {
      return next()
    }
  }
  next()
})

export default router
