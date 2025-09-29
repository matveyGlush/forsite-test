import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import ResultPage from '../pages/ResultPage.vue'
import FormA from '../components/FormA.vue'
import FormB from '../components/FormB.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/form/a', component: FormA },
  { path: '/form/b', component: FormB },
  { path: '/result', component: ResultPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router