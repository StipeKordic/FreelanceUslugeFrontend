import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import RegisterView from '../views/RegisterView.vue'
import LoggedInView from '../views/LoggedInView.vue'
import UserProfileView from '../views/UserProfileView.vue'
import ManagePostsView from '../views/ManagePostsView.vue'
import ManageUsersView from '../views/ManageUsersView.vue'
import ManageServicesView from '../views/ManageServicesView.vue'
import ErrorView from '../views/ErrorView.vue'


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView
  },
  {
    path: '/user',
    name: 'loggedin',
    component: LoggedInView
  },
  {
    path: '/user/profile',
    name: 'userProfile',
    component: UserProfileView
  },
  {
    path: '/user/manage/posts',
    name: 'managePosts',
    component: ManagePostsView
  },
  {
    path: '/user/manage/users',
    name: 'manageUsers',
    component: ManageUsersView
  },
  {
    path: '/user/manage/services',
    name: 'manageServices',
    component: ManageServicesView
  },
  {
    path: '/error',
    name: 'error',
    component: ErrorView
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
