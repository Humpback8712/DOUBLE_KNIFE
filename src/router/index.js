import Vue from 'vue'
import VueRouter from 'vue-router'
import WordIndex from '../components/Wordindex.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/word' },
  { path: '/word', component: WordIndex }

]

const router = new VueRouter({
  routes
})

export default router
