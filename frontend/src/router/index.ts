import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Result from '../components/Result.vue'
import FormA from '../components/FormA.vue'
import FormB from '../components/FormB.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/form/a', component: FormA },
  { path: '/form/b', component: FormB },
  { path: '/result', component: Result }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router